import React, { useState, useRef, useEffect } from 'react';
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Animated,
  PanResponder,
  useWindowDimensions,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Svg, { Polyline } from 'react-native-svg';
import { GlassView } from './GlassView';
import { useTheme } from '../context/ThemeContext';
import { RADII, SPACING } from '../theme/tokens';

export type DockState = 'none' | 'left' | 'right';

interface FloatingModalProps {
  id: string;
  title: string;
  icon?: React.ReactNode;
  headerRight?: React.ReactNode;
  children: React.ReactNode;
  defaultPosition?: { x: number; y: number };
  defaultDocked?: DockState;
  visible?: boolean;
}

export const FloatingModal: React.FC<FloatingModalProps> = ({
  id,
  title,
  icon,
  headerRight,
  children,
  defaultPosition = { x: 20, y: 80 },
  defaultDocked = 'none',
  visible = true,
}) => {
  const { colors } = useTheme();
  const { width: windowWidth } = useWindowDimensions();
  const modalWidth = Math.min(340, windowWidth - 40);
  const snapThreshold = 60;

  const [docked, setDocked] = useState<DockState>(defaultDocked);
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [snapPreview, setSnapPreview] = useState<'none' | 'left' | 'right'>('none');

  const pan = useRef(new Animated.ValueXY(defaultPosition)).current;
  const currentPos = useRef(defaultPosition);

  useEffect(() => {
    const listenerId = pan.addListener((value) => {
      currentPos.current = value;
    });
    return () => pan.removeListener(listenerId);
  }, [pan]);

  useEffect(() => {
    AsyncStorage.getItem(`modal-${id}`).then((stored) => {
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.position) {
            pan.setValue(parsed.position);
            currentPos.current = parsed.position;
          }
          if (parsed.docked !== undefined) setDocked(parsed.docked);
          if (parsed.isCollapsed !== undefined) setIsCollapsed(parsed.isCollapsed);
        } catch (e) {}
      }
    });
  }, [id, pan]);

  const saveState = (pos: { x: number; y: number }, dock: DockState, collapsed: boolean) => {
    AsyncStorage.setItem(
      `modal-${id}`,
      JSON.stringify({ position: pos, docked: dock, isCollapsed: collapsed })
    );
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: () => {
        pan.setOffset({
          x: currentPos.current.x,
          y: currentPos.current.y,
        });
        pan.setValue({ x: 0, y: 0 });
      },
      onPanResponderMove: (_, gestureState) => {
        pan.setValue({ x: gestureState.dx, y: gestureState.dy });

        const rawX = currentPos.current.x;
        if (rawX < snapThreshold) {
          setSnapPreview('left');
        } else if (windowWidth - (rawX + modalWidth) < snapThreshold) {
          setSnapPreview('right');
        } else {
          setSnapPreview('none');
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        pan.flattenOffset();

        const rawX = currentPos.current.x;
        let finalDock: DockState = 'none';

        if (rawX < snapThreshold) {
          finalDock = 'left';
        } else if (windowWidth - (rawX + modalWidth) < snapThreshold) {
          finalDock = 'right';
        }

        setSnapPreview('none');
        if (finalDock !== 'none') {
          setDocked(finalDock);
        }
        saveState(currentPos.current, finalDock, isCollapsed);
      },
    })
  ).current;

  const undock = () => {
    let newX = 20;
    if (docked === 'right') {
      newX = Math.max(20, windowWidth - modalWidth - 20);
    }
    const newPos = { x: newX, y: Math.max(70, currentPos.current.y) };
    pan.setValue(newPos);
    currentPos.current = newPos;
    setDocked('none');
    saveState(newPos, 'none', isCollapsed);
  };

  const toggleCollapse = () => {
    setIsCollapsed((prev) => {
      const next = !prev;
      saveState(currentPos.current, docked, next);
      return next;
    });
  };

  if (!visible) return null;

  if (docked !== 'none') {
    const isLeft = docked === 'left';
    return (
      <View
        style={[
          styles.dockTabContainer,
          isLeft ? { left: 0 } : { right: 0 },
          { top: Math.max(70, currentPos.current.y) },
        ]}
      >
        <TouchableOpacity onPress={undock} activeOpacity={0.8}>
          <GlassView
            borderRadius={0}
            style={[
              styles.dockTab,
              isLeft
                ? { borderTopRightRadius: RADII.md, borderBottomRightRadius: RADII.md }
                : { borderTopLeftRadius: RADII.md, borderBottomLeftRadius: RADII.md },
            ]}
          >
            <View style={styles.dockTabInner}>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <Polyline
                  points={isLeft ? '9 18 15 12 9 6' : '15 18 9 12 15 6'}
                  stroke={colors.accent}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
              <Text style={[styles.dockTitle, { color: colors.textPrimary }]}>{title}</Text>
            </View>
          </GlassView>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <>
      {snapPreview !== 'none' && (
        <View
          style={[
            styles.snapPreview,
            snapPreview === 'left' ? { left: 0 } : { right: 0 },
            { backgroundColor: colors.accent + '25', borderColor: colors.accent },
          ]}
        />
      )}

      <Animated.View
        style={[
          styles.modalContainer,
          { width: modalWidth },
          {
            transform: pan.getTranslateTransform(),
          },
        ]}
      >
        <GlassView style={styles.glassContainer}>
          <View style={styles.header} {...panResponder.panHandlers}>
            <View style={styles.titleWrapper}>
              {icon && <View style={styles.iconContainer}>{icon}</View>}
              <Text style={[styles.title, { color: colors.textPrimary }]} numberOfLines={1}>
                {title}
              </Text>
            </View>
            {headerRight && <View style={styles.headerRightContainer}>{headerRight}</View>}
            <TouchableOpacity onPress={toggleCollapse} style={styles.chevronBtn} hitSlop={10}>
              <Svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                <Polyline
                  points={isCollapsed ? '6 9 12 15 18 9' : '18 15 12 9 6 15'}
                  stroke={colors.textSecondary}
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </Svg>
            </TouchableOpacity>
          </View>

          {!isCollapsed && <View style={styles.content}>{children}</View>}
        </GlassView>
      </Animated.View>
    </>
  );
};

const styles = StyleSheet.create({
  modalContainer: {
    position: 'absolute',
    left: 0,
    top: 0,
    zIndex: 50,
  },
  glassContainer: {
    paddingBottom: SPACING.sm,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.sm + 2,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(255,255,255,0.1)',
  },
  titleWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: SPACING.xs,
  },
  iconContainer: {
    marginRight: SPACING.xs + 2,
  },
  title: {
    fontSize: 14,
    fontWeight: '600',
    letterSpacing: -0.2,
  },
  headerRightContainer: {
    marginRight: SPACING.xs + 2,
  },
  chevronBtn: {
    padding: 4,
  },
  content: {
    maxHeight: 420,
  },
  dockTabContainer: {
    position: 'absolute',
    zIndex: 60,
  },
  dockTab: {
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.sm,
  },
  dockTabInner: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dockTitle: {
    fontSize: 12,
    fontWeight: '600',
  },
  snapPreview: {
    position: 'absolute',
    top: 60,
    bottom: 0,
    width: 60,
    borderWidth: 2,
    borderStyle: 'dashed',
    borderRadius: RADII.lg,
    zIndex: 40,
    opacity: 0.8,
  },
});
