import React from 'react';
import dynamic from 'next/dynamic';
import { DeviceType } from '../DeviceSelector/DeviceSelector';
import DeviceMockup from '../DeviceMockup/DeviceMockup';
import styles from './CentralView.module.css';

const ComponentPreview: any = dynamic(
  () => import('../ComponentPreview/ComponentPreview'),
  { ssr: false }
);

interface CentralViewProps {
  activeDevice: DeviceType;
  pickerProps: Record<string, any>;
  updateProp: (name: string, value: any) => void;
}

export default function CentralView({
  activeDevice,
  pickerProps,
  updateProp,
}: CentralViewProps) {
  return (
    <div className={styles.central}>
      <div className={styles.gridBackground} />
      <div className={styles.container}>
        <DeviceMockup device={activeDevice}>
          <ComponentPreview props={pickerProps} updateProp={updateProp} />
        </DeviceMockup>
      </div>
    </div>
  );
}
