export type PropType = 
  | 'number' 
  | 'color' 
  | 'boolean' 
  | 'enum' 
  | 'readonly'
  | 'text'
  | 'date'
  | 'tick-rules';

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
  // ── Selection (1-to-1 mapping with RulerDatePickerProps) ──
  {
    name: 'value',
    type: 'text',
    label: 'value',
    category: 'Selection',
    description: 'Currently selected date (controlled). Accepts Date or YYYY-MM-DD string.',
  },
  {
    name: 'minDate',
    type: 'text',
    label: 'minDate',
    category: 'Selection',
    defaultValue: '',
    description: 'Minimum selectable date boundary (YYYY-MM-DD string or Date).',
  },
  {
    name: 'maxDate',
    type: 'text',
    label: 'maxDate',
    category: 'Selection',
    defaultValue: '',
    description: 'Maximum selectable date boundary (YYYY-MM-DD string or Date).',
  },
  {
    name: 'ticks',
    type: 'tick-rules',
    label: 'ticks',
    category: 'Selection',
    defaultValue: 'calendar',
    description: 'Array of graduation rules or preset name (calendar, metric, minimal).',
  },

  // ── Dimensions (1-to-1 mapping with RulerDatePickerProps) ──
  {
    name: 'tickSpacing',
    type: 'number',
    label: 'tickSpacing',
    category: 'Dimensions',
    defaultValue: 24,
    min: 10,
    max: 100,
    step: 1,
    description: 'Horizontal gap between tick centers in pixels.',
  },
  {
    name: 'rulerHeight',
    type: 'number',
    label: 'rulerHeight',
    category: 'Dimensions',
    defaultValue: 60,
    min: 30,
    max: 150,
    step: 5,
    description: 'Height of the ruler track viewport in pixels.',
  },
  {
    name: 'indicator.width',
    type: 'number',
    label: 'indicator.width',
    category: 'Dimensions',
    defaultValue: 2,
    min: 1,
    max: 10,
    step: 1,
    description: 'Width of the center needle pointer in pixels.',
  },
  {
    name: 'indicator.height',
    type: 'number',
    label: 'indicator.height',
    category: 'Dimensions',
    defaultValue: 40,
    min: 10,
    max: 80,
    step: 5,
    description: 'Height of the center needle pointer in pixels.',
  },

  // ── Colors (1-to-1 mapping with RulerTheme) ──
  {
    name: 'theme.background',
    type: 'color',
    label: 'theme.background',
    category: 'Colors',
    description: 'Component background color token.',
  },
  {
    name: 'theme.indicatorColor',
    type: 'color',
    label: 'theme.indicatorColor',
    category: 'Colors',
    description: 'Center indicator pointer needle color.',
  },
  {
    name: 'theme.accentColor',
    type: 'color',
    label: 'theme.accentColor',
    category: 'Colors',
    description: 'Primary accent color for today indicator badge.',
  },
  {
    name: 'theme.labelColor',
    type: 'color',
    label: 'theme.labelColor',
    category: 'Colors',
    description: 'Color of date and year label text.',
  },
  {
    name: 'theme.defaultTickColor',
    type: 'color',
    label: 'theme.defaultTickColor',
    category: 'Colors',
    description: 'Base color for unstyled tick bars.',
  },
  {
    name: 'theme.rangeHighlightColor',
    type: 'color',
    label: 'theme.rangeHighlightColor',
    category: 'Colors',
    description: 'Color for range selection connecting bar in range mode.',
  },

  // ── Features (1-to-1 mapping with RulerDatePickerProps) ──
  {
    name: 'header.showResetToToday',
    type: 'boolean',
    label: 'header.showResetToToday',
    category: 'Features',
    defaultValue: false,
    description: 'Show "Today" reset pill button in header when scrolled away.',
  },
  {
    name: 'haptics',
    type: 'boolean',
    label: 'haptics',
    category: 'Features',
    defaultValue: true,
    description: 'Dual-speed tactile haptic vibration engine.',
  },
  {
    name: 'lensEffect',
    type: 'boolean',
    label: 'lensEffect',
    category: 'Features',
    defaultValue: false,
    description: 'Non-linear fisheye lens distortion with magnified center spacing.',
  },
];
