"use client";

import { useState, useCallback, useRef } from 'react';
import { EXAMPLES, ExamplePreset } from '../data/examples';
import { generateCodeSnippet, SnippetMode } from '../utils/generateCodeSnippet';
import { parseCodeToProps } from '../utils/liveCodeParser';

const DEFAULT_TODAY_STR = new Date().toISOString().split('T')[0];

export function usePickerProps() {
  const [props, setProps] = useState<Record<string, any>>({
    value: DEFAULT_TODAY_STR,
    ...EXAMPLES[0].props,
  });
  const [activeExampleId, setActiveExampleId] = useState<string>(EXAMPLES[0].id);
  const [codeMode, setCodeMode] = useState<SnippetMode>('full');
  const [codeError, setCodeError] = useState<{
    message: string;
    line?: number;
    column?: number;
  } | null>(null);

  // Initial code snippet
  const [code, setCode] = useState<string>(() =>
    generateCodeSnippet({
      props: EXAMPLES[0].props,
      presetName: EXAMPLES[0].name,
      mode: 'full',
    })
  );

  // Debounce ref for parsing code edits
  const parseDebounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const loadPreset = useCallback((preset: ExamplePreset) => {
    const updatedProps = {
      value: DEFAULT_TODAY_STR,
      ...preset.props,
    };
    setProps(updatedProps);
    setActiveExampleId(preset.id);
    setCodeError(null);
    setCode(
      generateCodeSnippet({
        props: preset.props,
        presetName: preset.name,
        mode: codeMode,
      })
    );
  }, [codeMode]);

  const updateProp = useCallback(
    (name: string, value: any) => {
      setProps((prev) => {
        let updated: Record<string, any>;
        if (name.includes('.')) {
          const [parentKey, childKey] = name.split('.');
          const parentObj =
            typeof prev[parentKey] === 'object' && prev[parentKey] !== null
              ? { ...prev[parentKey] }
              : {};
          parentObj[childKey] = value;
          updated = {
            ...prev,
            [parentKey]: parentObj,
          };
        } else {
          updated = {
            ...prev,
            [name]: value,
          };
        }

        // Synchronize code snippet when updated via GUI controls
        if (name !== 'value') {
          setCode(
            generateCodeSnippet({
              props: updated,
              presetName: 'Custom Configuration',
              mode: codeMode,
            })
          );
        }

        return updated;
      });

      if (name !== 'value') {
        setActiveExampleId('custom');
        setCodeError(null);
      }
    },
    [codeMode]
  );

  const updateFromCode = useCallback((newCode: string) => {
    setCode(newCode);

    if (parseDebounceTimerRef.current) {
      clearTimeout(parseDebounceTimerRef.current);
    }

    parseDebounceTimerRef.current = setTimeout(() => {
      const res = parseCodeToProps(newCode);
      if (res.success && res.props) {
        setCodeError(null);
        setActiveExampleId('custom');
        setProps((prev) => ({
          ...prev,
          ...res.props,
          // Preserve currently selected value if not overridden
          value: res.props?.value ?? prev.value,
        }));
      } else if (res.error) {
        setCodeError(res.error);
      }
    }, 150);
  }, []);

  const handleModeChange = useCallback(
    (newMode: SnippetMode) => {
      setCodeMode(newMode);
      setCode(
        generateCodeSnippet({
          props,
          presetName:
            activeExampleId === 'custom'
              ? 'Custom Configuration'
              : EXAMPLES.find((e) => e.id === activeExampleId)?.name ?? 'Custom Configuration',
          mode: newMode,
        })
      );
    },
    [props, activeExampleId]
  );

  const resetCode = useCallback(() => {
    const currentPreset =
      EXAMPLES.find((e) => e.id === activeExampleId) ?? EXAMPLES[0];
    setCodeError(null);
    setCode(
      generateCodeSnippet({
        props: currentPreset.props,
        presetName: currentPreset.name,
        mode: codeMode,
      })
    );
    setProps({
      value: DEFAULT_TODAY_STR,
      ...currentPreset.props,
    });
  }, [activeExampleId, codeMode]);

  return {
    props,
    activeExampleId,
    loadPreset,
    updateProp,
    code,
    codeMode,
    setCodeMode: handleModeChange,
    codeError,
    updateFromCode,
    resetCode,
  };
}
