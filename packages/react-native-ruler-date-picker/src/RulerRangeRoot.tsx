import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { RulerDateRangePickerProps, RangeIndicatorConfig } from './types';
import { useRulerDateRangePicker } from './useRulerDateRangePicker';
import { RulerRangeContext } from './RulerRangeContext';

export interface RulerRangeRootProps extends RulerDateRangePickerProps {
  children?: React.ReactNode;
}

export function RulerRangeRoot(props: RulerRangeRootProps) {
  const {
    children,
    style,
    indicator,
    highlight,
    testID,
  } = props;

  const rangeRuler = useRulerDateRangePicker(props);
  const indicatorConfig: RangeIndicatorConfig | undefined =
    typeof indicator === 'object' ? indicator : undefined;
  const headerConfig =
    typeof props.header === 'object' ? props.header : undefined;
  const highlightConfig =
    typeof highlight === 'object' ? highlight : undefined;

  const contextValue = {
    ...rangeRuler,
    indicatorConfig,
    headerConfig,
    highlightConfig,
    locale: props.locale,
  };

  return (
    <RulerRangeContext.Provider value={contextValue}>
      <View
        testID={testID}
        accessible={true}
        accessibilityRole="adjustable"
        accessibilityLabel={props.accessibilityLabel ?? 'Date range picker'}
        accessibilityValue={{
          text: `${rangeRuler.startDateStr} to ${rangeRuler.endDateStr}`,
        }}
        accessibilityActions={[
          { name: 'increment', label: `Next day for ${rangeRuler.activeHandle} date` },
          { name: 'decrement', label: `Previous day for ${rangeRuler.activeHandle} date` },
        ]}
        onAccessibilityAction={(event) => {
          const isStart = rangeRuler.activeHandle === 'start';
          const target = new Date(isStart ? rangeRuler.startDate : rangeRuler.endDate);
          if (event.nativeEvent.actionName === 'increment') {
            target.setDate(target.getDate() + 1);
          } else if (event.nativeEvent.actionName === 'decrement') {
            target.setDate(target.getDate() - 1);
          }
          if (isStart) {
            rangeRuler.setRange(target, rangeRuler.endDate);
          } else {
            rangeRuler.setRange(rangeRuler.startDate, target);
          }
        }}
        style={[
          styles.container,
          {
            minHeight: rangeRuler.height,
            backgroundColor: rangeRuler.theme.background,
          },
          style,
        ]}
      >
        {children}
      </View>
    </RulerRangeContext.Provider>
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
