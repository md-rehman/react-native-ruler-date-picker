import React from 'react';
import { PropDefinition } from '../../../data/propDefinitions';
import ColorPicker from './ColorPicker';
import NumberInput from './NumberInput';
import EnumSelect from './EnumSelect';
import BooleanToggle from './BooleanToggle';
import styles from './PropControl.module.css';

import TickRulesEditor from './TickRulesEditor';

interface PropControlProps {
  definition: PropDefinition;
  value: any;
  onChange: (value: any) => void;
}

export default function PropControl({ definition, value, onChange }: PropControlProps) {
  const renderControl = () => {
    switch (definition.type) {
      case 'tick-rules':
        return <TickRulesEditor value={value} onChange={onChange} />;
      case 'text':
        return (
          <input
            type="text"
            className={styles.input}
            value={value ?? ''}
            placeholder={definition.defaultValue ? String(definition.defaultValue) : ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
      case 'date':
        return (
          <input
            type="date"
            className={styles.input}
            value={value ?? ''}
            onChange={(e) => onChange(e.target.value)}
          />
        );
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
        return <div className={styles.readonlyValue}>{value !== undefined && value !== null ? String(value) : 'None'}</div>;
      default:
        return null;
    }
  };

  const isFullWidth = definition.type === 'tick-rules';
  const displayLabel = definition.label.replace(/^theme\./, '');

  return (
    <div className={`${styles.container} ${isFullWidth ? styles.containerFullWidth : ''}`}>
      <div className={styles.header}>
        <label className={styles.label} title={definition.label}>{displayLabel}</label>
        {definition.description && (
          <span className={styles.tooltip} title={definition.description}>?</span>
        )}
      </div>
      <div className={`${styles.controlWrapper} ${isFullWidth ? styles.controlWrapperFull : ''}`}>
        {renderControl()}
      </div>
    </div>
  );
}
