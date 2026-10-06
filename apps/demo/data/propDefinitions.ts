export type PropType = 'number' | 'color' | 'boolean' | 'enum' | 'readonly';

export interface PropDefinition {
  name: string;
  type: PropType;
  label: string;
  category: 'Selection' | 'Dimensions' | 'Colors' | 'Features';
  defaultValue?: any;
  options?: string[]; // For enum type
  min?: number;
  max?: number;
  step?: number;
  description?: string;
}

export const PROP_DEFINITIONS: PropDefinition[] = [
  // Selection
  {
    name: 'selectedDate',
    type: 'readonly',
    label: 'Selected Date',
    category: 'Selection',
    description: 'The currently selected date.',
  },
  {
    name: 'labelInterval',
    type: 'enum',
    label: 'Label Interval',
    category: 'Selection',
    defaultValue: 'weekly',
    options: ['daily', 'weekly', 'monthly'],
  },

  // Dimensions
  {
    name: 'tickSpacing',
    type: 'number',
    label: 'Tick Spacing',
    category: 'Dimensions',
    defaultValue: 24,
    min: 10,
    max: 100,
    step: 1,
  },
  {
    name: 'tickHeight',
    type: 'number',
    label: 'Tick Height',
    category: 'Dimensions',
    defaultValue: 12,
    min: 4,
    max: 50,
  },
  {
    name: 'tickTallHeight',
    type: 'number',
    label: 'Tall Tick Height',
    category: 'Dimensions',
    defaultValue: 24,
    min: 10,
    max: 80,
  },
  {
    name: 'tickThickness',
    type: 'number',
    label: 'Tick Thickness',
    category: 'Dimensions',
    defaultValue: 4,
    min: 1,
    max: 20,
  },
  {
    name: 'height',
    type: 'number',
    label: 'Container Height',
    category: 'Dimensions',
    defaultValue: 120,
    min: 80,
    max: 300,
  },

  // Colors
  {
    name: 'tickColor',
    type: 'color',
    label: 'Tick Color',
    category: 'Colors',
  },
  {
    name: 'tickTallColor',
    type: 'color',
    label: 'Tall Tick Color',
    category: 'Colors',
  },
  {
    name: 'labelColor',
    type: 'color',
    label: 'Label Color',
    category: 'Colors',
  },
  {
    name: 'accentColor',
    type: 'color',
    label: 'Accent Color',
    category: 'Colors',
  },
  {
    name: 'indicatorColor',
    type: 'color',
    label: 'Indicator Color',
    category: 'Colors',
  },
  {
    name: 'backgroundColor',
    type: 'color',
    label: 'Background Color',
    category: 'Colors',
  },

  // Features
  {
    name: 'enableHaptics',
    type: 'boolean',
    label: 'Enable Haptics',
    category: 'Features',
    defaultValue: true,
  },
  {
    name: 'showResetToToday',
    type: 'boolean',
    label: 'Show Reset Button',
    category: 'Features',
    defaultValue: false,
  },
];
