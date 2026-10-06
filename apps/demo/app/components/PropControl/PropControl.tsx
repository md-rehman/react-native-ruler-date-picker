import React from 'react';
import { PropDefinition } from '../../../data/propDefinitions';
import ColorPicker from './ColorPicker';
import NumberInput from './NumberInput';
import EnumSelect from './EnumSelect';
import BooleanToggle from './BooleanToggle';
import styles from './PropControl.module.css';

interface PropControlProps {
  definition: PropDefinition;
  value: any;
  onChange: (value: any) => void;
}

export default function PropControl({ definition, value, onChange }: PropControlProps) {
  const renderControl = () => {
    switch (definition.type) {
      case 'color':
        return <ColorPicker value={value || ''} onChange={onChange} />;
      case 'number':
        return (
          <NumberInput 
            value={value ?? definition.defaultValue} 
            onChange={onChange}
            min={definition.min}
            max={definition.max}
            step={definition.step}
          />
        );
      case 'boolean':
        return <BooleanToggle value={value ?? definition.defaultValue} onChange={onChange} />;
      case 'enum':
        return (
          <EnumSelect 
            value={value ?? definition.defaultValue} 
            onChange={onChange}
            options={definition.options || []}
          />
        );
      case 'readonly':
        return <div className={styles.readonlyValue}>{String(value)}</div>;
      default:
        return null;
    }
  };

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <label className={styles.label}>{definition.label}</label>
        {definition.description && (
          <span className={styles.tooltip} title={definition.description}>?</span>
        )}
      </div>
      <div className={styles.controlWrapper}>
        {renderControl()}
      </div>
    </div>
  );
}
