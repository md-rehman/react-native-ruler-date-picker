import { useState, useCallback } from 'react';
import { EXAMPLES, ExamplePreset, ComponentType } from '../data/examples';

const DEFAULT_TODAY_STR = new Date().toISOString().split('T')[0];

export function usePickerProps() {
  const [componentType, setComponentType] = useState<ComponentType>(
    EXAMPLES[0].componentType || 'RulerDatePicker'
  );
  const [props, setProps] = useState<Record<string, any>>({
    value: DEFAULT_TODAY_STR,
    ...EXAMPLES[0].props,
  });
  const [activeExampleId, setActiveExampleId] = useState<string>(EXAMPLES[0].id);

  const loadPreset = useCallback((preset: ExamplePreset) => {
    setComponentType(preset.componentType);
    const updatedProps = {
      ...(preset.props.value !== undefined ? {} : { value: DEFAULT_TODAY_STR }),
      ...preset.props,
    };
    setProps(updatedProps);
    setActiveExampleId(preset.id);
  }, []);

  const updateProp = useCallback((name: string, value: any) => {
    setProps((prev) => {
      if (name.includes('.')) {
        const [parentKey, childKey] = name.split('.');
        const parentObj =
          typeof prev[parentKey] === 'object' && prev[parentKey] !== null
            ? { ...prev[parentKey] }
            : {};
        parentObj[childKey] = value;
        return {
          ...prev,
          [parentKey]: parentObj,
        };
      }
      return {
        ...prev,
        [name]: value,
      };
    });

    if (name !== 'value' && name !== 'value.start' && name !== 'value.end') {
      setActiveExampleId('custom');
    }
  }, []);

  return {
    componentType,
    props,
    activeExampleId,
    loadPreset,
    updateProp,
  };
}
