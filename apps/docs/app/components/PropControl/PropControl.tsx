import React from 'react';
import { PropDefinition } from '../../../data/propDefinitions';
import ColorPicker from './ColorPicker';
import NumberInput from './NumberInput';
import EnumSelect from './EnumSelect';
import BooleanToggle from './BooleanToggle';
import Tooltip from '../Tooltip/Tooltip';
import { ExperimentalBadge } from '../ExperimentalBadge/ExperimentalBadge';
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
      case 'offset': {
        const arr = Array.isArray(value) ? value : [0, 0];
        const x = typeof arr[0] === 'number' ? arr[0] : 0;
        const y = typeof arr[1] === 'number' ? arr[1] : 0;
        return (
          <div style={{ display: 'flex', gap: 6, alignItems: 'center', width: '100%' }}>
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>X</span>
            <NumberInput
              value={x}
              onChange={(newX) => onChange([newX, y])}
              min={-200}
              max={200}
              step={1}
            />
            <span style={{ fontSize: '0.72rem', color: 'var(--color-text-muted)', fontWeight: 600, marginLeft: 2 }}>Y</span>
            <NumberInput
              value={y}
              onChange={(newY) => onChange([x, newY])}
              min={-200}
              max={200}
              step={1}
            />
          </div>
        );
      }
      case 'readonly':
        return <div className={styles.readonlyValue}>{value !== undefined && value !== null ? String(value) : 'None'}</div>;
      default:
        return null;
    }
  };

  const isFullWidth = definition.type === 'tick-rules';
  const displayLabel = definition.label.replace(/^(theme|header|value)\./, '');

  return (
    <div className={`${styles.container} ${isFullWidth ? styles.containerFullWidth : ''}`}>
      <div className={styles.header}>
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, minWidth: 0 }}>
          <label className={styles.label} title={definition.label}>{displayLabel}</label>
          {definition.isExperimental && <ExperimentalBadge size="sm" />}
        </div>
        {definition.description && (
          <Tooltip content={definition.description}>
            <button
              type="button"
              className={styles.tooltip}
              aria-label={`Description for ${displayLabel}`}
            >
              ?
            </button>
          </Tooltip>
        )}
      </div>
      <div className={`${styles.controlWrapper} ${isFullWidth ? styles.controlWrapperFull : ''}`}>
        {renderControl()}
      </div>
    </div>
  );
}
