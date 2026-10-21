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

  const contextValue = {
    ...ruler,
    indicatorConfig,
    lensConfig,
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
