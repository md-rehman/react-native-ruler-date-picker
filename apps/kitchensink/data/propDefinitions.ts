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
    name: 'tickThickness',
    type: 'number',
    label: 'Tick Thickness',
    category: 'Dimensions',
    defaultValue: 3,
    min: 1,
    max: 12,
    step: 1,
    description: 'Thickness of tick bars in pixels.',
  },
  {
    name: 'height',
    type: 'number',
    label: 'Container Height',
    category: 'Dimensions',
    defaultValue: 120,
    min: 80,
    max: 300,
    step: 5,
    description: 'Total component height in pixels.',
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
    name: 'indicatorWidth',
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
    name: 'indicatorHeight',
    type: 'number',
    label: 'Indicator Height',
    category: 'Dimensions',
    defaultValue: 40,
    min: 10,
    max: 80,
    step: 5,
    description: 'Height of center pointer needle in pixels.',
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
    name: 'showHeader',
    type: 'boolean',
    label: 'Show Header',
    category: 'Features',
    defaultValue: true,
    description: 'Show date header above the ruler.',
  },
  {
    name: 'showResetToToday',
    type: 'boolean',
    label: 'Show Reset Button',
    category: 'Features',
    defaultValue: false,
    description: 'Show "Today" reset pill button when scrolled away.',
  },
  {
    name: 'enableHaptics',
    type: 'boolean',
    label: 'Enable Haptics',
    category: 'Features',
    defaultValue: true,
    description: 'Dual-speed tactile haptic vibration engine.',
  },
  {
    name: 'debounceMs',
    type: 'number',
    label: 'Debounce (ms)',
    category: 'Features',
    defaultValue: 100,
    min: 0,
    max: 500,
    step: 25,
    description: 'Debounce interval before firing onChange during scrolling.',
  },
  {
    name: 'bufferTicks',
    type: 'number',
    label: 'Buffer Ticks',
    category: 'Features',
    defaultValue: 10,
    min: 2,
    max: 30,
    step: 1,
    description: 'Number of off-screen ticks rendered as buffer.',
  },
];
