import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { RulerDateRangePickerProps } from './types';
import { useRulerDateRangePicker } from './useRulerDateRangePicker';
import { RulerRangeContext } from './RulerRangeContext';
import { DEFAULTS } from './defaults';

export interface RulerRangeRootProps extends RulerDateRangePickerProps {
  children?: React.ReactNode;
}

export function RulerRangeRoot(props: RulerRangeRootProps) {
  const {
    children,
    style,
    indicatorWidth = DEFAULTS.indicatorWidth,
    indicatorHeight = DEFAULTS.indicatorHeight,
    indicatorColor,
    rangeHighlightColor,
    testID,
  } = props;

  const rangeRuler = useRulerDateRangePicker(props);

  const contextValue = {
    ...rangeRuler,
    indicatorWidth,
    indicatorHeight,
    indicatorColor,
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
