"use client";

import React, { useState } from 'react';
import styles from './TickRulesEditor.module.css';

export interface EditableTickRule {
  condition?: any;
  height: number;
  width?: number;
  color?: string;
  label?: boolean | { format?: any; color?: string; fontSize?: number; fontWeight?: any };
  dot?: boolean | { size?: number; color?: string };
}

const PRESET_CALENDAR_RULES: EditableTickRule[] = [
  {
    condition: 'monthly',
    height: 30,
    width: 3.5,
    label: true,
  },
  {
    condition: 'weekly',
    height: 24,
    width: 3,
    label: true,
  },
  {
    condition: { dayOfWeek: [0, 6] },
    height: 18,
    width: 2.5,
  },
  {
    condition: 'daily',
    height: 12,
    width: 2,
  },
];

const PRESET_METRIC_RULES: EditableTickRule[] = [
  {
    condition: { interval: 10 },
    height: 28,
    width: 3.5,
    label: true,
  },
  {
    condition: { interval: 5 },
    height: 18,
    width: 2.5,
  },
  {
    condition: 'daily',
    height: 12,
    width: 2,
  },
];

const PRESET_MINIMAL_RULES: EditableTickRule[] = [
  {
    condition: 'weekly',
    height: 24,
    width: 3,
    label: true,
  },
  {
    condition: 'daily',
    height: 12,
    width: 2,
  },
];

export const DEFAULT_NEW_TICK_RULE: EditableTickRule = {
  condition: 'daily',
  height: 16,
  width: 2.5,
  color: '',
  label: false,
  dot: false,
};

function normalizeRules(val: any): EditableTickRule[] {
  if (Array.isArray(val)) {
    return val;
  }
  if (val === 'metric') return PRESET_METRIC_RULES;
  if (val === 'minimal') return PRESET_MINIMAL_RULES;
  return PRESET_CALENDAR_RULES;
}

function getConditionType(condition: any): string {
  if (!condition || condition === 'daily') return 'daily';
  if (condition === 'weekly') return 'weekly';
  if (condition === 'monthly') return 'monthly';
  if (condition === 'yearly') return 'yearly';
  if (typeof condition === 'object') {
    if ('dayOfWeek' in condition) return 'weekend';
    if ('interval' in condition) return 'interval';
  }
  return 'daily';
}

function getConditionDisplay(condition: any): string {
  const type = getConditionType(condition);
  switch (type) {
    case 'monthly': return 'Monthly (1st)';
    case 'weekly': return 'Weekly (7d)';
    case 'weekend': return 'Weekend (Sat/Sun)';
    case 'interval': return `Every ${condition?.interval || 5} days`;
    case 'yearly': return 'Yearly (Jan 1)';
    default: return 'Daily (Base)';
  }
}

interface TickRulesEditorProps {
  value: any;
  onChange: (value: any) => void;
}

export default function TickRulesEditor({ value, onChange }: TickRulesEditorProps) {
  const rules = normalizeRules(value);
  const [expandedIndex, setExpandedIndex] = useState<number>(0);

  // Ensure exactly 1 menu is always open within valid bounds
  const activeExpandedIndex = Math.min(Math.max(0, expandedIndex), Math.max(0, rules.length - 1));

  const isPresetActive = (name: string) => {
    if (typeof value === 'string') return value === name;
    return false;
  };

  const handleSelectPreset = (name: 'calendar' | 'metric' | 'minimal') => {
    let presetRules: EditableTickRule[];
    if (name === 'metric') presetRules = [...PRESET_METRIC_RULES];
    else if (name === 'minimal') presetRules = [...PRESET_MINIMAL_RULES];
    else presetRules = [...PRESET_CALENDAR_RULES];

    onChange(presetRules);
    setExpandedIndex(0);
  };

  const updateRule = (index: number, partial: Partial<EditableTickRule>) => {
    const updated = rules.map((r, i) => (i === index ? { ...r, ...partial } : r));
    onChange(updated);
  };

  const handleConditionChange = (index: number, newType: string) => {
    let newCondition: any = 'daily';
    if (newType === 'monthly') newCondition = 'monthly';
    else if (newType === 'weekly') newCondition = 'weekly';
    else if (newType === 'yearly') newCondition = 'yearly';
    else if (newType === 'weekend') newCondition = { dayOfWeek: [0, 6] };
    else if (newType === 'interval') newCondition = { interval: 5 };

    updateRule(index, { condition: newCondition });
  };

  const handleIntervalNumberChange = (index: number, intervalValue: number) => {
    updateRule(index, { condition: { interval: Math.max(1, intervalValue) } });
  };

  const handleAddRule = () => {
    const newRule: EditableTickRule = { ...DEFAULT_NEW_TICK_RULE };
    const updated = [...rules, newRule];
    onChange(updated);
    setExpandedIndex(updated.length - 1);
  };

  const handleDeleteRule = (index: number, e: React.MouseEvent) => {
    e.stopPropagation();
    if (rules.length <= 1) return;
    const updated = rules.filter((_, i) => i !== index);
    onChange(updated);
    if (activeExpandedIndex === index) {
      setExpandedIndex(Math.max(0, Math.min(index, updated.length - 1)));
    } else if (activeExpandedIndex > index) {
      setExpandedIndex(activeExpandedIndex - 1);
    }
  };

  const handleMoveRule = (index: number, direction: 'up' | 'down', e: React.MouseEvent) => {
    e.stopPropagation();
    const target = direction === 'up' ? index - 1 : index + 1;
    if (target < 0 || target >= rules.length) return;
    const copy = [...rules];
    const [moved] = copy.splice(index, 1);
    copy.splice(target, 0, moved);
    onChange(copy);
    setExpandedIndex(target);
  };

  return (
    <div className={styles.container}>
      <div className={styles.presetBar}>
        <span className={styles.presetTitle}>Presets</span>
        <button
          type="button"
          className={`${styles.presetChip} ${isPresetActive('calendar') ? styles.presetChipActive : ''}`}
          onClick={() => handleSelectPreset('calendar')}
        >
          Calendar
        </button>
        <button
          type="button"
          className={`${styles.presetChip} ${isPresetActive('metric') ? styles.presetChipActive : ''}`}
          onClick={() => handleSelectPreset('metric')}
        >
          Metric
        </button>
        <button
          type="button"
          className={`${styles.presetChip} ${isPresetActive('minimal') ? styles.presetChipActive : ''}`}
          onClick={() => handleSelectPreset('minimal')}
        >
          Minimal
        </button>
      </div>

      <div className={styles.rulesList}>
        {rules.map((rule, idx) => {
          const isExpanded = activeExpandedIndex === idx;
          const conditionType = getConditionType(rule.condition);
          const hasLabel = Boolean(rule.label);
          const hasDot = Boolean(rule.dot);

          return (
            <div key={idx} className={`${styles.ruleCard} ${isExpanded ? styles.ruleCardExpanded : ''}`}>
              <div
                className={styles.cardHeader}
                onClick={() => setExpandedIndex(idx)}
              >
                <div className={styles.headerLeft}>
                  <span className={styles.badge}>#{idx + 1}</span>
                  <div className={styles.headerMeta}>
                    <span className={styles.conditionName}>{getConditionDisplay(rule.condition)}</span>
                    <span className={styles.specsPreview}>{rule.height}px · {rule.width ?? 3}w{hasLabel ? ' · label' : ''}{hasDot ? ' · dot' : ''}</span>
                  </div>
                </div>

                <div className={styles.headerActions}>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    disabled={idx === 0}
                    onClick={(e) => handleMoveRule(idx, 'up', e)}
                    title="Move higher (higher evaluation priority)"
                  >
                    ▲
                  </button>
                  <button
                    type="button"
                    className={styles.actionBtn}
                    disabled={idx === rules.length - 1}
                    onClick={(e) => handleMoveRule(idx, 'down', e)}
                    title="Move lower (lower priority)"
                  >
                    ▼
                  </button>
                  <button
                    type="button"
                    className={`${styles.actionBtn} ${styles.deleteBtn}`}
                    disabled={rules.length <= 1}
                    onClick={(e) => handleDeleteRule(idx, e)}
                    title="Remove rule"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {isExpanded && (
                <div className={styles.cardBody}>
                  {/* Condition Selector */}
                  <div className={styles.fieldRow}>
                    <label className={styles.fieldLabel}>Condition</label>
                    <div className={styles.fieldInputGroup}>
                      <select
                        className={styles.selectInput}
                        value={conditionType}
                        onChange={(e) => handleConditionChange(idx, e.target.value)}
                      >
                        <option value="daily">Daily (Default / Fallback)</option>
                        <option value="weekly">Weekly (Every 7 days)</option>
                        <option value="monthly">Monthly (1st of month)</option>
                        <option value="weekend">Weekend (Sat & Sun)</option>
                        <option value="interval">Interval (Every N days)</option>
                        <option value="yearly">Yearly (Jan 1)</option>
                      </select>
                    </div>
                  </div>

                  {/* Interval count if interval */}
                  {conditionType === 'interval' && (
                    <div className={styles.fieldRow}>
                      <label className={styles.fieldLabel}>Every N Days</label>
                      <input
                        type="number"
                        className={styles.numberInput}
                        min={1}
                        max={100}
                        value={rule.condition?.interval ?? 5}
                        onChange={(e) => handleIntervalNumberChange(idx, parseInt(e.target.value, 10) || 1)}
                      />
                    </div>
                  )}

                  {/* Height */}
                  <div className={styles.fieldRow}>
                    <label className={styles.fieldLabel}>Height (px)</label>
                    <div className={styles.fieldInputGroup}>
                      <input
                        type="range"
                        className={styles.rangeInput}
                        min={4}
                        max={50}
                        value={rule.height}
                        onChange={(e) => updateRule(idx, { height: Number(e.target.value) })}
                      />
                      <input
                        type="number"
                        className={styles.numberInput}
                        min={4}
                        max={50}
                        value={rule.height}
                        onChange={(e) => updateRule(idx, { height: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Width */}
                  <div className={styles.fieldRow}>
                    <label className={styles.fieldLabel}>Width (px)</label>
                    <div className={styles.fieldInputGroup}>
                      <input
                        type="range"
                        className={styles.rangeInput}
                        min={1}
                        max={10}
                        step={0.5}
                        value={rule.width ?? 3}
                        onChange={(e) => updateRule(idx, { width: Number(e.target.value) })}
                      />
                      <input
                        type="number"
                        className={styles.numberInput}
                        min={1}
                        max={10}
                        step={0.5}
                        value={rule.width ?? 3}
                        onChange={(e) => updateRule(idx, { width: Number(e.target.value) })}
                      />
                    </div>
                  </div>

                  {/* Color Override */}
                  <div className={styles.fieldRow}>
                    <label className={styles.fieldLabel}>Color</label>
                    <div className={styles.colorRow}>
                      <div
                        className={styles.colorThumb}
                        style={{ backgroundColor: rule.color || 'var(--color-border)' }}
                      >
                        <input
                          type="color"
                          className={styles.colorPickerInput}
                          value={rule.color || '#38BDF8'}
                          onChange={(e) => updateRule(idx, { color: e.target.value })}
                        />
                      </div>
                      <input
                        type="text"
                        className={styles.colorHex}
                        placeholder="Inherited"
                        value={rule.color || ''}
                        onChange={(e) => updateRule(idx, { color: e.target.value })}
                      />
                      {rule.color && (
                        <button
                          type="button"
                          className={styles.clearColorBtn}
                          onClick={() => updateRule(idx, { color: undefined })}
                        >
                          Reset
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Label Toggle */}
                  <div className={styles.fieldRow}>
                    <label className={styles.fieldLabel}>Show Date Label</label>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        checked={hasLabel}
                        onChange={(e) => updateRule(idx, { label: e.target.checked })}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>

                  {/* Dot Badge Toggle */}
                  <div className={styles.fieldRow}>
                    <label className={styles.fieldLabel}>Show Dot Indicator</label>
                    <label className={styles.toggleSwitch}>
                      <input
                        type="checkbox"
                        checked={hasDot}
                        onChange={(e) => updateRule(idx, { dot: e.target.checked })}
                      />
                      <span className={styles.toggleSlider}></span>
                    </label>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Plus Sign Button to Add More Items */}
      <button
        type="button"
        className={styles.addRuleButton}
        onClick={handleAddRule}
      >
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <line x1="12" y1="5" x2="12" y2="19"></line>
          <line x1="5" y1="12" x2="19" y2="12"></line>
        </svg>
        <span>Add Tick Rule</span>
      </button>
    </div>
  );
}
