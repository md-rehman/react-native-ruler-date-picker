import React from 'react';
import { DeviceType } from '../DeviceSelector/DeviceSelector';
import styles from './DeviceMockup.module.css';

interface DeviceMockupProps {
  device: DeviceType;
  children: React.ReactNode;
}

export default function DeviceMockup({ device, children }: DeviceMockupProps) {
  if (device === 'iphone') {
    return (
      <div className={`${styles.device} ${styles.iphone}`}>
        <div className={styles.island}></div>
        <div className={styles.screen}>{children}</div>
      </div>
    );
  }

  if (device === 'android') {
    return (
      <div className={`${styles.device} ${styles.android}`}>
        <div className={styles.punchhole}></div>
        <div className={styles.screen}>{children}</div>
      </div>
    );
  }

  // Web fallback
  return (
    <div className={`${styles.device} ${styles.web}`}>
      <div className={styles.browserBar}>
        <div className={styles.browserDots}>
          <span></span><span></span><span></span>
        </div>
        <div className={styles.addressBar}></div>
      </div>
      <div className={styles.screen}>{children}</div>
    </div>
  );
}
