"use client";

import React from 'react';
import { PROP_DEFINITIONS, PropDefinition, getPropGroupsForComponent } from '../../../data/propDefinitions';
import { ComponentType } from '../../../data/examples';
import PropControl from '../PropControl/PropControl';
import styles from './PropsPanel.module.css';

interface PropsPanelProps {
  pickerProps: Record<string, any>;
  componentType?: ComponentType;
  updateProp: (name: string, value: any) => void;
}

function getPropValue(props: Record<string, any>, name: string) {
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    return props[parent]?.[child];
  }
  return props[name];
}

export default function PropsPanel({
  pickerProps,
  componentType = 'RulerDatePicker',
  updateProp,
}: PropsPanelProps) {
  const propMap = React.useMemo(() => {
    const map = new Map<string, PropDefinition>();
    PROP_DEFINITIONS.forEach((p) => map.set(p.name, p));
    return map;
  }, []);

  const propGroups = React.useMemo(() => {
    return getPropGroupsForComponent(componentType);
  }, [componentType]);

  return (
    <div className={styles.container}>

      {propGroups.map((group) => {
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
