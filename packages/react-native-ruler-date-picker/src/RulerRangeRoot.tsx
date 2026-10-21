import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { RulerDateRangePickerProps, IndicatorConfig } from './types';
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
    rangeHighlightColor,
    testID,
  } = props;

  const rangeRuler = useRulerDateRangePicker(props);
  const indicatorConfig: IndicatorConfig | undefined =
    typeof indicator === 'object' ? indicator : undefined;
  const headerConfig =
    typeof props.header === 'object' ? props.header : undefined;

  const contextValue = {
    ...rangeRuler,
    indicatorConfig,
    headerConfig,
    locale: props.locale,
    rangeHighlightColor,
  };

  return (
    <RulerRangeContext.Provider value={contextValue}>
      <View
        testID={testID}
        style={[
          styles.container,
          {
            height: rangeRuler.height,
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
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
});
