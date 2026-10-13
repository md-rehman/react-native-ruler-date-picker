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
    name: 'tickThickness',
    type: 'number',
    label: 'tickThickness',
    category: 'Dimensions',
    defaultValue: 3,
    min: 1,
    max: 12,
    step: 1,
    description: 'Base thickness of tick bars in pixels.',
  },
  {
    name: 'height',
    type: 'number',
    label: 'height',
    category: 'Dimensions',
    defaultValue: 120,
    min: 80,
    max: 300,
    step: 5,
    description: 'Total height of the component container in pixels.',
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
    name: 'indicatorWidth',
    type: 'number',
    label: 'indicatorWidth',
    category: 'Dimensions',
    defaultValue: 2,
    min: 1,
    max: 10,
    step: 1,
    description: 'Width of the center needle pointer in pixels.',
  },
  {
    name: 'indicatorHeight',
    type: 'number',
    label: 'indicatorHeight',
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
    name: 'showHeader',
    type: 'boolean',
    label: 'showHeader',
    category: 'Features',
    defaultValue: true,
    description: 'Show or hide the date header above the ruler.',
  },
  {
    name: 'showResetToToday',
    type: 'boolean',
    label: 'showResetToToday',
    category: 'Features',
    defaultValue: false,
    description: 'Show "Today" reset pill button when scrolled away.',
  },
  {
    name: 'enableHaptics',
    type: 'boolean',
    label: 'enableHaptics',
    category: 'Features',
    defaultValue: true,
    description: 'Dual-speed tactile haptic vibration engine.',
  },
  {
    name: 'debounceMs',
    type: 'number',
    label: 'debounceMs',
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
    label: 'bufferTicks',
    category: 'Features',
    defaultValue: 10,
    min: 2,
    max: 30,
    step: 1,
    description: 'Number of off-screen ticks rendered as buffer.',
  },
  {
    name: 'fastSwipeTickThreshold',
    type: 'number',
    label: 'fastSwipeTickThreshold',
    category: 'Features',
    defaultValue: 1,
    min: 0.5,
    max: 5,
    step: 0.5,
    description: 'Speed threshold (ticks/frame) to trigger continuous haptic mode.',
  },
  {
    name: 'continuousHapticIntervalMs',
    type: 'number',
    label: 'continuousHapticIntervalMs',
    category: 'Features',
    defaultValue: 20,
    min: 5,
    max: 100,
    step: 5,
    description: 'Pulse interval in ms during continuous haptic mode.',
  },
];
