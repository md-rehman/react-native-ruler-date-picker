import { useCallback, useRef } from 'react';
import { Platform } from 'react-native';
import { DEFAULTS } from './defaults';

/**
 * Attempts to dynamically require expo-haptics.
 * Returns null if the module is not installed, allowing graceful degradation
 * in pure React Native CLI projects.
 */
let ExpoHaptics: typeof import('expo-haptics') | null = null;
try {
  ExpoHaptics = require('expo-haptics');
} catch {
  // expo-haptics not installed — haptics will be silently disabled
}

interface UseHapticsOptions {
  enableHaptics: boolean;
  onHapticTrigger?: (mode: 'tick' | 'continuous') => void;
  continuousHapticIntervalMs: number;
}

interface HapticsAPI {
  fireDiscreteHaptic: () => void;
  startContinuousHaptic: () => void;
  stopContinuousHaptic: () => void;
}

/**
 * Haptics abstraction hook.
 *
 * - If `onHapticTrigger` is provided, delegates all haptic calls to it.
 * - Otherwise, uses expo-haptics if available.
 * - Falls back to no-op if neither is available or haptics are disabled.
 */
export function useHaptics({
  enableHaptics,
  onHapticTrigger,
  continuousHapticIntervalMs = DEFAULTS.continuousHapticIntervalMs,
}: UseHapticsOptions): HapticsAPI {
  const hapticIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  /** Fire a single discrete haptic — used in slow scroll mode */
  const fireDiscreteHaptic = useCallback(() => {
    if (!enableHaptics) return;

    if (onHapticTrigger) {
      onHapticTrigger('tick');
      return;
    }

    if (!ExpoHaptics) return;

    if (Platform.OS === 'android') {
      ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light).catch(
        () => {}
      );
    } else {
      ExpoHaptics.selectionAsync().catch(() => {});
    }
  }, [enableHaptics, onHapticTrigger]);

  /** Start a continuous haptic buzz — used in fast scroll mode */
  const startContinuousHaptic = useCallback(() => {
    if (!enableHaptics) return;

    if (onHapticTrigger) {
      onHapticTrigger('continuous');
      return;
    }

    if (!ExpoHaptics) return;

    // Already running — don't double-start
    if (hapticIntervalRef.current) return;

    // Fire one immediately so the transition isn't silent
    ExpoHaptics.impactAsync(ExpoHaptics.ImpactFeedbackStyle.Light).catch(
      () => {}
    );

    const interval =
      Platform.OS === 'android' ? 35 : continuousHapticIntervalMs;

    hapticIntervalRef.current = setInterval(() => {
      ExpoHaptics!.impactAsync(ExpoHaptics!.ImpactFeedbackStyle.Light).catch(
        () => {}
      );
    }, interval);
  }, [enableHaptics, onHapticTrigger, continuousHapticIntervalMs]);

  /** Stop the continuous haptic buzz */
  const stopContinuousHaptic = useCallback(() => {
    if (hapticIntervalRef.current) {
      clearInterval(hapticIntervalRef.current);
      hapticIntervalRef.current = null;
    }
  }, []);

  return {
    fireDiscreteHaptic,
    startContinuousHaptic,
    stopContinuousHaptic,
  };
}
