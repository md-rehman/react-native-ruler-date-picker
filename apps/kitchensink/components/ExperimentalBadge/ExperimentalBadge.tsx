import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity } from 'react-native';
import { ExperimentalIcon } from './ExperimentalIcon';

export interface ExperimentalBadgeProps {
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
  color?: string;
}

export function ExperimentalBadge({
  showText = false,
  size = 'sm',
  color = '#F59E0B',
}: ExperimentalBadgeProps) {
  const [expanded, setExpanded] = useState(showText);

  const iconSizes = {
    sm: 12,
    md: 14,
    lg: 16,
  };

  const isTextVisible = showText || expanded;

  return (
    <TouchableOpacity
      activeOpacity={0.8}
      onPress={() => setExpanded((prev) => !prev)}
      style={[
        styles.badge,
        size === 'sm' && styles.badgeSm,
        size === 'lg' && styles.badgeLg,
      ]}
    >
      <ExperimentalIcon size={iconSizes[size]} color={color} />
      {isTextVisible && (
        <Text style={[styles.text, { color }]}>EXPERIMENTAL</Text>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(245, 158, 11, 0.12)',
    borderColor: 'rgba(245, 158, 11, 0.28)',
    borderWidth: 1,
    borderRadius: 9999,
    paddingHorizontal: 5,
    paddingVertical: 2,
    gap: 4,
  },
  badgeSm: {
    paddingHorizontal: 4,
    paddingVertical: 1.5,
  },
  badgeLg: {
    paddingHorizontal: 7,
    paddingVertical: 3,
  },
  text: {
    fontSize: 9,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
});

export default ExperimentalBadge;
