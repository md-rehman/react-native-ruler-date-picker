import React, { createContext, useContext } from 'react';
import type { UseRulerDatePickerReturn } from './useRulerDatePicker';

export interface RulerContextValue extends UseRulerDatePickerReturn {
  indicatorWidth?: number;
  indicatorHeight?: number;
  indicatorColor?: string;
  renderIndicator?: () => React.ReactNode;
}

export const RulerContext = createContext<RulerContextValue | null>(null);

export function useRulerContext(): RulerContextValue {
  const context = useContext(RulerContext);
  if (!context) {
    throw new Error('Ruler compound subcomponents must be rendered within a <Ruler.Root> provider.');
  }
  return context;
}
