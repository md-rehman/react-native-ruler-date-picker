import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { RulerDatePickerProps, IndicatorConfig } from './types';
import { useRulerDatePicker } from './useRulerDatePicker';
import { RulerContext } from './RulerContext';
import { DEFAULT_LENS_CONFIG } from './defaults';

export interface RulerRootProps extends RulerDatePickerProps {
  children?: React.ReactNode;
}

export function RulerRoot(props: RulerRootProps) {
  const {
    children,
    style,
    indicator,
    lensEffect,
    testID,
  } = props;

  const ruler = useRulerDatePicker(props);

  const lensConfig = React.useMemo(() => {
    if (!lensEffect) return null;
    if (typeof lensEffect === 'object') {
      return {
        ...DEFAULT_LENS_CONFIG,
        ...lensEffect,
      };
    }
    return DEFAULT_LENS_CONFIG;
  }, [lensEffect]);

  const indicatorConfig: IndicatorConfig | undefined =
    typeof indicator === 'object' ? indicator : undefined;
  const headerConfig =
    typeof props.header === 'object' ? props.header : undefined;

  const contextValue = {
    ...ruler,
    indicatorConfig,
    headerConfig,
    locale: props.locale,
    lensConfig,
  };

  return (
    <RulerContext.Provider value={contextValue}>
      <View
        testID={testID}
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel={props.accessibilityLabel ?? 'Date picker'}
        accessibilityValue={{ text: ruler.selectedDateStr }}
        accessibilityActions={[
          { name: 'increment', label: 'Next day' },
          { name: 'decrement', label: 'Previous day' },
        ]}
        onAccessibilityAction={(event) => {
          if (event.nativeEvent.actionName === 'increment') {
            const next = new Date(ruler.selectedDate);
            next.setDate(next.getDate() + 1);
            ruler.scrollToDate(next, true);
          } else if (event.nativeEvent.actionName === 'decrement') {
            const prev = new Date(ruler.selectedDate);
            prev.setDate(prev.getDate() - 1);
            ruler.scrollToDate(prev, true);
          }
        }}
        style={[
          styles.container,
          {
            minHeight: ruler.height,
            backgroundColor: ruler.theme.background,
          },
          style,
        ]}
      >
        {children}
      </View>
    </RulerContext.Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    position: 'relative',
    width: '100%',
    paddingVertical: 8,
  },
});
