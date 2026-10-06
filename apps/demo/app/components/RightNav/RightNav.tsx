import React from 'react';
import { PROP_DEFINITIONS, PropDefinition } from '../../../data/propDefinitions';
import PropControl from '../PropControl/PropControl';
import styles from './RightNav.module.css';

interface RightNavProps {
  isOpen: boolean;
  onClose: () => void;
  pickerProps: Record<string, any>;
  updateProp: (name: string, value: any) => void;
}

export default function RightNav({ isOpen, onClose, pickerProps, updateProp }: RightNavProps) {
  // Group properties by category
  const groupedProps = PROP_DEFINITIONS.reduce((acc, prop) => {
    if (!acc[prop.category]) {
      acc[prop.category] = [];
    }
    acc[prop.category].push(prop);
    return acc;
  }, {} as Record<string, PropDefinition[]>);

  return (
    <nav className={`${styles.nav} glass ${isOpen ? styles.open : styles.closed}`}>
      <div className={styles.header}>
        <h2>Properties</h2>
      </div>
      <div className={styles.content}>
        {Object.entries(groupedProps).map(([category, props]) => (
          <div key={category} className={styles.category}>
            <h3 className={styles.categoryTitle}>{category}</h3>
            <div className={styles.propsList}>
              {props.map(prop => (
                <PropControl
                  key={prop.name}
                  definition={prop}
                  value={pickerProps[prop.name]}
                  onChange={(val) => updateProp(prop.name, val)}
                />
              ))}
            </div>
          </div>
        ))}
      </div>
    </nav>
  );
}
