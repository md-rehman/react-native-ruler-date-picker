import React from 'react';
import { View, StyleSheet } from 'react-native';
import type { RulerDatePickerProps } from './types';
import { useRulerDatePicker } from './useRulerDatePicker';
import { RulerContext } from './RulerContext';
import { DEFAULTS } from './defaults';

export interface RulerRootProps extends RulerDatePickerProps {
  children?: React.ReactNode;
}

export function RulerRoot(props: RulerRootProps) {
  const {
    children,
    style,
    indicatorWidth = DEFAULTS.indicatorWidth,
    indicatorHeight = DEFAULTS.indicatorHeight,
    indicatorColor,
    renderIndicator,
    testID,
  } = props;

  const ruler = useRulerDatePicker(props);

  const contextValue = {
    ...ruler,
    indicatorWidth,
    indicatorHeight,
    indicatorColor,
    renderIndicator,
  };

  return (
    <RulerContext.Provider value={contextValue}>
      <View
        testID={testID}
        style={[
          styles.container,
          {
            height: ruler.height,
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
    overflow: 'hidden',
    position: 'relative',
    width: '100%',
  },
});
