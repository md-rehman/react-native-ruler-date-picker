"use client";

import { useState, useCallback } from 'react';
import { EXAMPLES, ExamplePreset } from '../data/examples';

const DEFAULT_TODAY_STR = new Date().toISOString().split('T')[0];

export function usePickerProps() {
  const [props, setProps] = useState<Record<string, any>>({
    value: DEFAULT_TODAY_STR,
    ...EXAMPLES[0].props,
  });
  const [activeExampleId, setActiveExampleId] = useState<string>(EXAMPLES[0].id);

  const loadPreset = useCallback((preset: ExamplePreset) => {
    setProps({
      value: DEFAULT_TODAY_STR,
      ...preset.props,
    });
    setActiveExampleId(preset.id);
  }, []);

  const updateProp = useCallback((name: string, value: any) => {
    setProps((prev) => {
      if (name.startsWith('theme.')) {
        const themeKey = name.split('.')[1];
        return {
          ...prev,
          theme: {
            ...prev.theme,
            [themeKey]: value,
          },
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });
    if (name !== 'value') {
      setActiveExampleId('custom');
    }
  }, []);

  return {
    props,
    activeExampleId,
    loadPreset,
    updateProp,
  };
}
