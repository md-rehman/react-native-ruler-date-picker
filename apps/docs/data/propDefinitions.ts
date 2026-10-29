import { ComponentType } from './examples';

export type PropType = 
  | 'number' 
  | 'color' 
  | 'boolean' 
  | 'enum' 
  | 'readonly'
  | 'text'
  | 'date'
  | 'offset'
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
  isExperimental?: boolean;
}

export interface PropGroup {
  id: string;
  label: string;
  propNames: string[];
}

export const PROP_DEFINITIONS: PropDefinition[] = [
  // ── Single Date Selection ──
  {
    name: 'value',
    type: 'text',
    label: 'value',
    category: 'Selection',
    defaultValue: 'Today',
    description: 'Currently selected date (controlled). Accepts Date or YYYY-MM-DD string.',
  },
  {
    name: 'minDate',
    type: 'text',
    label: 'minDate',
    category: 'Selection',
    defaultValue: 'Today - 365d',
    description: 'Minimum selectable date boundary (defaults to 1 year ago).',
  },
  {
    name: 'maxDate',
    type: 'text',
    label: 'maxDate',
    category: 'Selection',
    defaultValue: 'Today + 365d',
    description: 'Maximum selectable date boundary (defaults to 1 year ahead).',
  },
  {
    name: 'locale',
    type: 'text',
    label: 'locale',
    category: 'Selection',
    defaultValue: 'default',
    description: 'BCP 47 locale string for date formatting (e.g. en-US, de-DE, ja-JP).',
  },
  {
    name: 'ticks',
    type: 'tick-rules',
    label: 'ticks',
    category: 'Selection',
    defaultValue: 'calendar',
    description: 'Array of graduation rules or preset name (calendar, metric, minimal).',
  },

  // ── Range Selection (RulerDateRangePicker) ──
  {
    name: 'value.start',
    type: 'text',
    label: 'value.start',
    category: 'Selection',
    defaultValue: 'Today',
    description: 'Start boundary of the selected date interval (controlled).',
    isExperimental: true,
  },
  {
    name: 'value.end',
    type: 'text',
    label: 'value.end',
    category: 'Selection',
    defaultValue: 'Today + 7d',
    description: 'End boundary of the selected date interval (controlled).',
    isExperimental: true,
  },
  {
    name: 'minSpanDays',
    type: 'number',
    label: 'minSpanDays',
    category: 'Selection',
    defaultValue: 1,
    min: 1,
    max: 30,
    step: 1,
    description: 'Minimum allowed interval span in days between start and end handles.',
    isExperimental: true,
  },
  {
    name: 'maxSpanDays',
    type: 'number',
    label: 'maxSpanDays',
    category: 'Selection',
    defaultValue: 14,
    min: 1,
    max: 90,
    step: 1,
    description: 'Maximum allowed interval span in days between start and end handles.',
    isExperimental: true,
  },

  // ── Dimensions ──
  {
    name: 'width',
    type: 'number',
    label: 'width',
    category: 'Dimensions',
    defaultValue: 'Window width',
    min: 200,
    max: 1200,
    step: 10,
    description: 'Viewport width of the ruler in pixels (defaults to window width).',
  },
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
    name: 'tickWidth',
    type: 'number',
    label: 'tickWidth',
    category: 'Dimensions',
    defaultValue: 3,
    min: 1,
    max: 10,
    step: 1,
    description: 'Base thickness/width of tick bars in pixels.',
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
  {
    name: 'indicator.offset',
    type: 'offset',
    label: 'indicator.offset',
    category: 'Dimensions',
    defaultValue: [0, 0],
    description: 'Offset [x, y] in pixels of the center needle pointer. Default [0, 0] anchors to the bottom.',
  },

  // ── Colors (Theme Tokens) ──
  {
    name: 'theme.background',
    type: 'color',
    label: 'theme.background',
    category: 'Colors',
    defaultValue: 'transparent',
    description: 'Component background color token.',
  },
  {
    name: 'theme.indicatorColor',
    type: 'color',
    label: 'theme.indicatorColor',
    category: 'Colors',
    defaultValue: '#3B82F6 (Light) / #60A5FA (Dark)',
    description: 'Indicator pointer needle color.',
  },
  {
    name: 'theme.accentColor',
    type: 'color',
    label: 'theme.accentColor',
    category: 'Colors',
    defaultValue: '#3B82F6 (Light) / #60A5FA (Dark)',
    description: 'Primary accent color for badges, handles, and highlights.',
  },
  {
    name: 'theme.labelColor',
    type: 'color',
    label: 'theme.labelColor',
    category: 'Colors',
    defaultValue: '#6B7280 (Light) / #9CA3AF (Dark)',
    description: 'Color of date and year label text.',
  },
  {
    name: 'theme.defaultTickColor',
    type: 'color',
    label: 'theme.defaultTickColor',
    category: 'Colors',
    defaultValue: '#D1D5DB (Light) / #4B5563 (Dark)',
    description: 'Base color for unstyled tick bars.',
  },
  {
    name: 'theme.rangeHighlightColor',
    type: 'color',
    label: 'theme.rangeHighlightColor',
    category: 'Colors',
    defaultValue: 'rgba(59, 130, 246, 0.2)',
    description: 'Color for range connecting highlight strip in range mode.',
    isExperimental: true,
  },

  // ── Features & Flags ──
  {
    name: 'haptics',
    type: 'boolean',
    label: 'haptics',
    category: 'Features',
    defaultValue: true,
    description: 'Dual-speed tactile haptic vibration engine.',
  },
  {
    name: 'highlight',
    type: 'boolean',
    label: 'highlight',
    category: 'Features',
    defaultValue: true,
    description: 'Dynamic connecting highlight strip between start and end handles in range mode.',
    isExperimental: true,
  },
  {
    name: 'lensEffect',
    type: 'boolean',
    label: 'lensEffect',
    category: 'Features',
    defaultValue: false,
    description: 'Non-linear fisheye lens distortion with magnified center spacing.',
  },
  {
    name: 'header.showResetToToday',
    type: 'boolean',
    label: 'header.showResetToToday',
    category: 'Features',
    defaultValue: false,
    description: 'Show "Today" reset pill button in header when scrolled away.',
  },
  {
    name: 'header.resetLabel',
    type: 'text',
    label: 'header.resetLabel',
    category: 'Features',
    defaultValue: 'Today',
    description: 'Text label displayed on the reset button.',
  },
  {
    name: 'accessibilityLabel',
    type: 'text',
    label: 'accessibilityLabel',
    category: 'Features',
    defaultValue: 'Date picker',
    description: 'Accessibility label for screen readers (VoiceOver & TalkBack).',
  },
];

export function getPropGroupsForComponent(componentType: ComponentType): PropGroup[] {
  switch (componentType) {
    case 'RulerDateRangePicker':
    case 'RulerRangeCompound':
    case 'useRulerDateRangePicker':
      return [
        {
          id: 'range',
          label: 'Range & Spans',
          propNames: ['value.start', 'value.end', 'minSpanDays', 'maxSpanDays', 'minDate', 'maxDate', 'locale'],
        },
        {
          id: 'dimensions',
          label: 'Dimensions & Sizing',
          propNames: [
            'width',
            'rulerHeight',
            'tickSpacing',
            'tickWidth',
            'indicator.width',
            'indicator.height',
            'indicator.offset',
          ],
        },
        {
          id: 'rules',
          label: 'Graduation Rules',
          propNames: ['ticks'],
        },
        {
          id: 'colors',
          label: 'Colors & Theme',
          propNames: [
            'theme.background',
            'theme.indicatorColor',
            'theme.accentColor',
            'theme.rangeHighlightColor',
            'theme.labelColor',
            'theme.defaultTickColor',
          ],
        },
        {
          id: 'features',
          label: 'Features & Toggles',
          propNames: [
            'highlight',
            'haptics',
            'lensEffect',
            'accessibilityLabel',
          ],
        },
      ];

    case 'RulerCompound':
      return [
        {
          id: 'selection',
          label: 'Date & Selection',
          propNames: ['value', 'minDate', 'maxDate', 'locale'],
        },
        {
          id: 'dimensions',
          label: 'Dimensions & Sizing',
          propNames: [
            'width',
            'rulerHeight',
            'tickSpacing',
            'tickWidth',
            'indicator.width',
            'indicator.height',
          ],
        },
        {
          id: 'colors',
          label: 'Colors & Theme',
          propNames: [
            'theme.background',
            'theme.indicatorColor',
            'theme.accentColor',
            'theme.labelColor',
            'theme.defaultTickColor',
          ],
        },
        {
          id: 'features',
          label: 'Features & Subcomponents',
          propNames: [
            'haptics',
            'header.showResetToToday',
            'header.resetLabel',
          ],
        },
      ];

    case 'useRulerDatePicker':
      return [
        {
          id: 'selection',
          label: 'Hook Parameters',
          propNames: ['value', 'minDate', 'maxDate'],
        },
        {
          id: 'dimensions',
          label: 'Dimensions & Spacing',
          propNames: ['tickSpacing', 'rulerHeight'],
        },
        {
          id: 'colors',
          label: 'Theme & Accent',
          propNames: [
            'theme.background',
            'theme.indicatorColor',
            'theme.accentColor',
            'theme.labelColor',
          ],
        },
      ];

    case 'RulerDatePicker':
    default:
      return [
        {
          id: 'selection',
          label: 'Date & Selection',
          propNames: ['value', 'minDate', 'maxDate', 'locale'],
        },
        {
          id: 'dimensions',
          label: 'Dimensions & Sizing',
          propNames: [
            'width',
            'rulerHeight',
            'tickSpacing',
            'tickWidth',
            'indicator.width',
            'indicator.height',
            'indicator.offset',
          ],
        },
        {
          id: 'rules',
          label: 'Graduation Rules',
          propNames: ['ticks'],
        },
        {
          id: 'colors',
          label: 'Colors & Theme',
          propNames: [
            'theme.background',
            'theme.indicatorColor',
            'theme.accentColor',
            'theme.labelColor',
            'theme.defaultTickColor',
            'theme.rangeHighlightColor',
          ],
        },
        {
          id: 'features',
          label: 'Features & Toggles',
          propNames: [
            'haptics',
            'lensEffect',
            'header.showResetToToday',
            'header.resetLabel',
            'accessibilityLabel',
          ],
        },
      ];
  }
}
