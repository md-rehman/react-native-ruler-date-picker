export type PropType = 'number' | 'color' | 'boolean' | 'enum' | 'readonly';
export type Category = 'Selection' | 'Dimensions' | 'Colors' | 'Features';

export interface PropDefinition {
  name: string;
  type: PropType;
  label: string;
  category: Category;
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
    name: 'ticks',
    type: 'enum',
    label: 'Tick Preset',
    category: 'Selection',
    defaultValue: 'calendar',
    options: ['calendar', 'metric', 'minimal'],
    description: 'Graduation preset rules.',
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
    description: 'Distance between tick centers in pixels.',
  },
  {
    name: 'tickWidth',
    type: 'number',
    label: 'Tick Width',
    category: 'Dimensions',
    defaultValue: 3,
    min: 1,
    max: 10,
    step: 1,
    description: 'Base thickness of tick bars in pixels.',
  },
  {
    name: 'rulerHeight',
    type: 'number',
    label: 'Ruler Height',
    category: 'Dimensions',
    defaultValue: 60,
    min: 30,
    max: 150,
    step: 5,
    description: 'Height of the ruler viewport track in pixels.',
  },
  {
    name: 'indicator.width',
    type: 'number',
    label: 'Indicator Width',
    category: 'Dimensions',
    defaultValue: 2,
    min: 1,
    max: 10,
    step: 1,
    description: 'Width of center pointer needle in pixels.',
  },
  {
    name: 'indicator.height',
    type: 'number',
    label: 'Indicator Height',
    category: 'Dimensions',
    defaultValue: 40,
    min: 10,
    max: 80,
    step: 5,
    description: 'Height of center pointer needle in pixels.',
  },
  {
    name: 'indicator.alignment',
    type: 'enum',
    label: 'Indicator Alignment',
    category: 'Dimensions',
    defaultValue: 'bottom',
    options: ['bottom', 'center', 'top'],
    description: 'Vertical alignment of center needle pointer.',
  },

  // Colors (theme.* mapping)
  {
    name: 'theme.background',
    type: 'color',
    label: 'Background',
    category: 'Colors',
    description: 'Component background color token.',
  },
  {
    name: 'theme.indicatorColor',
    type: 'color',
    label: 'Indicator Color',
    category: 'Colors',
    description: 'Center indicator needle pointer color.',
  },
  {
    name: 'theme.accentColor',
    type: 'color',
    label: 'Accent Color',
    category: 'Colors',
    description: 'Color for today dot badge and accents.',
  },
  {
    name: 'theme.labelColor',
    type: 'color',
    label: 'Label Color',
    category: 'Colors',
    description: 'Color of date and year label text.',
  },
  {
    name: 'theme.defaultTickColor',
    type: 'color',
    label: 'Default Tick Color',
    category: 'Colors',
    description: 'Base color for unstyled tick bars.',
  },

  // Features
  {
    name: 'header.showResetToToday',
    type: 'boolean',
    label: 'Show Reset Button',
    category: 'Features',
    defaultValue: false,
    description: 'Show "Today" reset pill button in header when scrolled away.',
  },
  {
    name: 'haptics',
    type: 'boolean',
    label: 'Enable Haptics',
    category: 'Features',
    defaultValue: true,
    description: 'Dual-speed tactile haptic vibration engine.',
  },
];
