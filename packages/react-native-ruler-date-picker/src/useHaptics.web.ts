import { useCallback, useRef } from 'react';
import { DEFAULTS } from './defaults';

interface UseHapticsOptions {
  enableHaptics: boolean;
  onHapticTrigger?: (mode: 'tick' | 'continuous') => void;
  continuousHapticIntervalMs?: number;
}

interface HapticsAPI {
  fireDiscreteHaptic: () => void;
  startContinuousHaptic: () => void;
  stopContinuousHaptic: () => void;
}

/**
 * Haptics hook implementation for Web environments.
 * Delegates to onHapticTrigger if provided, otherwise gracefully no-ops without requiring expo-haptics.
 */
export function useHaptics({
  enableHaptics,
  onHapticTrigger,
  continuousHapticIntervalMs = DEFAULTS.continuousHapticIntervalMs,
}: UseHapticsOptions): HapticsAPI {
  const hapticIntervalRef = useRef<ReturnType<typeof setInterval> | null>(
    null
  );

  const fireDiscreteHaptic = useCallback(() => {
    if (!enableHaptics || !onHapticTrigger) return;
    onHapticTrigger('tick');
  }, [enableHaptics, onHapticTrigger]);

  const startContinuousHaptic = useCallback(() => {
    if (!enableHaptics || !onHapticTrigger) return;
    if (hapticIntervalRef.current) return;
    onHapticTrigger('continuous');
    hapticIntervalRef.current = setInterval(() => {
      onHapticTrigger('continuous');
    }, continuousHapticIntervalMs);
  }, [enableHaptics, onHapticTrigger, continuousHapticIntervalMs]);

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
