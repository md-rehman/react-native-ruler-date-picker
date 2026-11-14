import React, { useMemo } from 'react';
import { StyleSheet, View, Text, ScrollView } from 'react-native';
import { PROP_DEFINITIONS, PropDefinition, getPropGroupsForComponent } from '../data/propDefinitions';
import { ComponentType } from '../data/examples';
import { PropControl } from './PropControl/PropControl';
import { useTheme } from '../context/ThemeContext';
import { SPACING, RADII } from '../theme/tokens';

interface PropsPanelProps {
  pickerProps: Record<string, any>;
  componentType?: ComponentType;
  updateProp: (name: string, value: any) => void;
}

function getPropValue(props: Record<string, any>, name: string) {
  if (name.includes('.')) {
    const [parent, child] = name.split('.');
    return props[parent]?.[child];
  }
  return props[name];
}

export const PropsPanel: React.FC<PropsPanelProps> = ({
  pickerProps,
  componentType = 'RulerDatePicker',
  updateProp,
}) => {
  const { colors } = useTheme();

  const propMap = useMemo(() => {
    const map = new Map<string, PropDefinition>();
    PROP_DEFINITIONS.forEach((p) => map.set(p.name, p));
    return map;
  }, []);

  const propGroups = useMemo(() => {
    return getPropGroupsForComponent(componentType);
  }, [componentType]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled"
    >
      {propGroups.map((group) => {
        const groupProps = group.propNames
          .map((name) => propMap.get(name))
          .filter((p): p is PropDefinition => Boolean(p));

        if (groupProps.length === 0) return null;

        return (
          <View key={group.id} style={styles.group}>
            <View style={styles.groupHeader}>
              <Text style={[styles.groupTitle, { color: colors.textMuted }]}>
                {group.label.toUpperCase()}
              </Text>
              <View style={[styles.groupDivider, { backgroundColor: colors.glassBorderColor }]} />
            </View>

            <View style={styles.groupList}>
              {groupProps.map((prop) => (
                <PropControl
                  key={prop.name}
                  definition={prop}
                  value={getPropValue(pickerProps, prop.name)}
                  onChange={(val) => updateProp(prop.name, val)}
                />
              ))}
            </View>
          </View>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flexShrink: 1,
  },
  content: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.xs,
    paddingBottom: SPACING.xl,
    gap: SPACING.md,
  },
  group: {
    gap: SPACING.xs,
  },
  groupHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
    paddingTop: SPACING.xs,
    paddingBottom: 2,
  },
  groupTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  groupDivider: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
  },
  groupList: {
    gap: 4,
  },
});
