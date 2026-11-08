import { createContext, useContext } from 'react';
import type { UseRulerDateRangePickerReturn } from './useRulerDateRangePicker';
import type { RangeIndicatorConfig, RangeHeaderConfig, RangeHighlightConfig } from './types';

export interface RulerRangeContextValue extends UseRulerDateRangePickerReturn {
  indicatorConfig?: RangeIndicatorConfig;
  headerConfig?: RangeHeaderConfig;
  highlightConfig?: RangeHighlightConfig;
  locale?: string;
}

export const RulerRangeContext = createContext<RulerRangeContextValue | null>(null);

export function useRulerRangeContext(): RulerRangeContextValue {
  const context = useContext(RulerRangeContext);
  if (!context) {
    throw new Error('RulerRange compound subcomponents must be rendered within a <RulerRange.Root> provider.');
  }
  return context;
}
