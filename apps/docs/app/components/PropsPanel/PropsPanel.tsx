"use client";

import React from 'react';
import { PROP_DEFINITIONS, PropDefinition } from '../../../data/propDefinitions';
import PropControl from '../PropControl/PropControl';
import styles from './PropsPanel.module.css';

interface PropsPanelProps {
  pickerProps: Record<string, any>;
  updateProp: (name: string, value: any) => void;
}

function getPropValue(props: Record<string, any>, name: string) {
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    return props[parent]?.[child];
  }
  return props[name];
}

interface PropGroup {
  id: string;
  label: string;
  propNames: string[];
}

const PROP_GROUPS: PropGroup[] = [
  {
    id: 'selection',
    label: 'Date & Selection',
    propNames: ['value', 'minDate', 'maxDate', 'locale'],
  },
  {
    id: 'dimensions',
    label: 'Dimensions & Sizing',
    propNames: [
      'width',
      'rulerHeight',
      'tickSpacing',
      'tickWidth',
      'indicator.width',
      'indicator.height',
      'indicator.alignment',
    ],
  },
  {
    id: 'rules',
    label: 'Graduation Rules',
    propNames: ['ticks'],
  },
  {
    id: 'colors',
    label: 'Colors & Theme',
    propNames: [
      'theme.background',
      'theme.indicatorColor',
      'theme.accentColor',
      'theme.labelColor',
      'theme.defaultTickColor',
      'theme.rangeHighlightColor',
    ],
  },
  {
    id: 'features',
    label: 'Features & Toggles',
    propNames: [
      'haptics',
      'lensEffect',
      'header.showResetToToday',
      'header.resetLabel',
      'accessibilityLabel',
    ],
  },
];

export default function PropsPanel({ pickerProps, updateProp }: PropsPanelProps) {
  const propMap = React.useMemo(() => {
    const map = new Map<string, PropDefinition>();
    PROP_DEFINITIONS.forEach((p) => map.set(p.name, p));
    return map;
  }, []);

  return (
    <div className={styles.container}>
      {PROP_GROUPS.map((group) => {
        const groupProps = group.propNames
          .map((name) => propMap.get(name))
          .filter((p): p is PropDefinition => Boolean(p));

        if (groupProps.length === 0) return null;

        return (
          <div key={group.id} className={styles.group}>
            <div className={styles.groupHeader}>
              <span className={styles.groupTitle}>{group.label}</span>
              <div className={styles.groupDivider} />
            </div>

            <div className={styles.groupList}>
              {groupProps.map((prop) => (
                <PropControl
                  key={prop.name}
                  definition={prop}
                  value={getPropValue(pickerProps, prop.name)}
                  onChange={(val) => updateProp(prop.name, val)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
