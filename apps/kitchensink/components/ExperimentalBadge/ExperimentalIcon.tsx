import React from 'react';
import Svg, { Circle, Rect, Path } from 'react-native-svg';

export interface ExperimentalIconProps {
  size?: number;
  color?: string;
}

/**
 * Custom Erlenmeyer Flask Icon for experimental components, hooks, and props.
 * React Native implementation using react-native-svg.
 */
export function ExperimentalIcon({
  size = 14,
  color = '#F59E0B',
}: ExperimentalIconProps) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
      {/* Floating Bubbles Above Flask */}
      <Circle cx="10.8" cy="2.2" r="1.0" fill={color} />
      <Circle cx="12.5" cy="4.8" r="1.3" fill={color} />

      {/* Flask Mouth Rim */}
      <Rect
        x="8.2"
        y="6.8"
        width="7.6"
        height="1.8"
        rx="0.9"
        fill={color}
      />

      {/* Flask Glass Body Outline */}
      <Path
        d="M 9.5 8.6 V 11.8 L 4.6 19.6 C 4.0 20.6 4.7 21.8 5.9 21.8 H 18.1 C 19.3 21.8 20.0 20.6 19.4 19.6 L 14.5 11.8 V 8.6"
        stroke={color}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Liquid inside the bottom chamber with wavy fluid surface */}
      <Path
        d="M 5.8 18.2 C 8.6 19.2 11.8 18.6 14.2 17.4 C 15.6 16.7 16.8 16.8 17.6 17.2 L 18.5 19.6 C 18.8 20.3 18.3 21.0 17.5 21.0 H 6.5 C 5.7 21.0 5.2 20.3 5.5 19.6 Z"
        fill={color}
        opacity={0.9}
      />

      {/* Internal Rising Bubbles in Chamber Air Space */}
      <Circle cx="12.0" cy="10.6" r="0.8" fill={color} />
      <Circle cx="12.8" cy="13.4" r="1.0" fill={color} />
      <Circle cx="11.2" cy="15.8" r="1.35" fill={color} />
    </Svg>
  );
}

export default ExperimentalIcon;
