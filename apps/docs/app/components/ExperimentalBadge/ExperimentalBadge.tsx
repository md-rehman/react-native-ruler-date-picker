"use client";

import React from 'react';
import { ExperimentalIcon } from './ExperimentalIcon';
import styles from './ExperimentalBadge.module.css';

export interface ExperimentalBadgeProps {
  /**
   * If true, always displays both icon and "Experimental" text statically (used in DocHeader).
   * If false (default), displays only the custom icon and reveals "Experimental" on hover.
   */
  showText?: boolean;
  /** Size variant */
  size?: 'sm' | 'md' | 'lg';
  /** Custom icon pixel dimension (default based on size: sm=12, md=14, lg=16) */
  iconSize?: number;
  /** Optional custom text (default: "Experimental") */
  text?: string;
  className?: string;
  style?: React.CSSProperties;
}

export function ExperimentalBadge({
  showText = false,
  size = 'md',
  iconSize,
  text = 'Experimental',
  className = '',
  style,
}: ExperimentalBadgeProps) {
  const [isHovered, setIsHovered] = React.useState(false);

  const resolvedIconSize =
    iconSize ?? (size === 'sm' ? 12 : size === 'lg' ? 16 : 14);

  const sizeClass =
    size === 'sm' ? styles.sizeSm : size === 'lg' ? styles.sizeLg : '';

  return (
    <span
      className={`${styles.badge} ${sizeClass} ${showText ? styles.badgeStatic : ''} ${isHovered ? styles.badgeHovered : ''} ${className}`}
      style={style}
      title="Experimental feature"
      aria-label="Experimental feature"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      tabIndex={0}
    >
      <span className={styles.icon}>
        <ExperimentalIcon size={resolvedIconSize} />
      </span>
      <span className={styles.label}>{text}</span>
    </span>
  );
}

export default ExperimentalBadge;
export { ExperimentalIcon };
