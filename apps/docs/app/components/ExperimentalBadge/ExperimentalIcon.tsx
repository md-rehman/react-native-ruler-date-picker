import React from 'react';

export interface ExperimentalIconProps extends React.SVGProps<SVGSVGElement> {
  size?: number;
  className?: string;
}

/**
 * Custom Erlenmeyer Flask Icon for experimental components, hooks, and props.
 * Features:
 * - Two floating rising bubbles above the flask mouth
 * - Flask rim lip and cylindrical neck
 * - Conical body with rounded bottom corners and flat base
 * - Wavy liquid surface with filled bottom chamber
 * - Rising effervescent bubbles inside the flask
 */
export function ExperimentalIcon({
  size = 16,
  className,
  style,
  ...props
}: ExperimentalIconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      className={className}
      style={{ display: 'inline-block', verticalAlign: 'middle', flexShrink: 0, ...style }}
      aria-hidden="true"
      {...props}
    >
      {/* Floating Bubbles Above Flask */}
      <circle cx="10.8" cy="2.2" r="1.0" fill="currentColor" />
      <circle cx="12.5" cy="4.8" r="1.3" fill="currentColor" />

      {/* Flask Mouth Rim */}
      <rect
        x="8.2"
        y="6.8"
        width="7.6"
        height="1.8"
        rx="0.9"
        fill="currentColor"
      />

      {/* Flask Glass Body Outline */}
      <path
        d="M 9.5 8.6 V 11.8 L 4.6 19.6 C 4.0 20.6 4.7 21.8 5.9 21.8 H 18.1 C 19.3 21.8 20.0 20.6 19.4 19.6 L 14.5 11.8 V 8.6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />

      {/* Liquid inside the bottom chamber with wavy fluid surface */}
      <path
        d="M 5.8 18.2 C 8.6 19.2 11.8 18.6 14.2 17.4 C 15.6 16.7 16.8 16.8 17.6 17.2 L 18.5 19.6 C 18.8 20.3 18.3 21.0 17.5 21.0 H 6.5 C 5.7 21.0 5.2 20.3 5.5 19.6 Z"
        fill="currentColor"
        opacity="0.9"
      />

      {/* Internal Rising Bubbles in Chamber Air Space */}
      {/* 1. Neck bubble */}
      <circle cx="12.0" cy="10.6" r="0.8" fill="currentColor" />
      {/* 2. Middle cone bubble */}
      <circle cx="12.8" cy="13.4" r="1.0" fill="currentColor" />
      {/* 3. Lower cone bubble floating above liquid trough */}
      <circle cx="11.2" cy="15.8" r="1.35" fill="currentColor" />
    </svg>
  );
}

export default ExperimentalIcon;
