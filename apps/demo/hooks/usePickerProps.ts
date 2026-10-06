"use client";

import { useState, useCallback } from 'react';
import { EXAMPLES, ExamplePreset } from '../data/examples';

export function usePickerProps() {
  const [props, setProps] = useState<Record<string, any>>(EXAMPLES[0].props);
  const [activeExampleId, setActiveExampleId] = useState<string>(EXAMPLES[0].id);

  const loadPreset = useCallback((preset: ExamplePreset) => {
    setProps(preset.props);
    setActiveExampleId(preset.id);
  }, []);

  const updateProp = useCallback((name: string, value: any) => {
    setProps((prev) => ({
      ...prev,
      [name]: value,
    }));
    setActiveExampleId('custom');
  }, []);

  return {
    props,
    activeExampleId,
    loadPreset,
    updateProp,
  };
}
