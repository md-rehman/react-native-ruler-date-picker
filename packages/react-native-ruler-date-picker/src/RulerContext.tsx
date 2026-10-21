import { createContext, useContext } from 'react';
import type { UseRulerDatePickerReturn } from './useRulerDatePicker';
import type { LensConfig, IndicatorConfig } from './types';

export interface RulerContextValue extends UseRulerDatePickerReturn {
  indicatorConfig?: IndicatorConfig;
  lensConfig?: Required<LensConfig> | null;
}

export const RulerContext = createContext<RulerContextValue | null>(null);

export function useRulerContext(): RulerContextValue {
  const context = useContext(RulerContext);
  if (!context) {
    throw new Error('Ruler compound subcomponents must be rendered within a <Ruler.Root> provider.');
  }
  return context;
}
