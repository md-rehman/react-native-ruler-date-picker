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
    defaultValue: 380,
    min: 200,
    max: 1200,
    step: 10,
    description: 'Viewport width of the ruler in pixels.',
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
    description: 'Height of the ruler viewport track in pixels.',
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
    description: 'Width of center pointer needle in pixels.',
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
    description: 'Height of center pointer needle in pixels.',
  },
  {
    name: 'indicator.offset',
    type: 'offset',
    label: 'indicator.offset',
    category: 'Dimensions',
    defaultValue: [0, 0],
    description: 'Offset [x, y] in pixels of center needle pointer.',
  },

  // ── Colors (theme.* mapping) ──
  {
    name: 'theme.background',
    type: 'color',
    label: 'background',
    category: 'Colors',
    defaultValue: 'transparent',
    description: 'Component background color token.',
  },
  {
    name: 'theme.indicatorColor',
    type: 'color',
    label: 'indicatorColor',
    category: 'Colors',
    description: 'Center indicator needle line/stroke color.',
  },
  {
    name: 'theme.accentColor',
    type: 'color',
    label: 'accentColor',
    category: 'Colors',
    description: 'Active highlight, today marker, and interactive accent color.',
  },
  {
    name: 'theme.labelColor',
    type: 'color',
    label: 'labelColor',
    category: 'Colors',
    description: 'Primary text label and header color.',
  },
  {
    name: 'theme.defaultTickColor',
    type: 'color',
    label: 'defaultTickColor',
    category: 'Colors',
    description: 'Fallback color for graduation marks that do not specify a color.',
  },
  {
    name: 'theme.rangeHighlightColor',
    type: 'color',
    label: 'rangeHighlightColor',
    category: 'Colors',
    description: 'Background fill color of the connected interval strip between range handles.',
    isExperimental: true,
  },

  // ── Features & Toggles ──
  {
    name: 'haptics',
    type: 'boolean',
    label: 'haptics',
    category: 'Features',
    defaultValue: true,
    description: 'Enable tactile feedback ticks on scroll (iOS/Android).',
  },
  {
    name: 'highlight',
    type: 'boolean',
    label: 'highlight',
    category: 'Features',
    defaultValue: true,
    description: 'Render connection fill strip between range handles (RulerDateRangePicker).',
    isExperimental: true,
  },
  {
    name: 'lensEffect',
    type: 'boolean',
    label: 'lensEffect',
    category: 'Features',
    defaultValue: false,
    description: 'Enable non-linear fisheye optical magnification distortion.',
  },
  {
    name: 'header.showResetToToday',
    type: 'boolean',
    label: 'showResetToToday',
    category: 'Features',
    defaultValue: true,
    description: 'Display quick "Today" return button in the header.',
  },
  {
    name: 'header.resetLabel',
    type: 'text',
    label: 'resetLabel',
    category: 'Features',
    defaultValue: 'Today',
    description: 'Custom label text for the reset button.',
  },
  {
    name: 'accessibilityLabel',
    type: 'text',
    label: 'accessibilityLabel',
    category: 'Features',
    defaultValue: 'Date ruler picker',
    description: 'Screen reader accessibility label for assistive technologies.',
  },
];

export function getPropGroupsForComponent(componentType: ComponentType): PropGroup[] {
  switch (componentType) {
    case 'RulerDateRangePicker':
      return [
        {
          id: 'selection',
          label: 'Range Selection',
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
          label: 'Colors & Highlight Theme',
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
            'highlight',
            'header.showResetToToday',
            'header.resetLabel',
            'accessibilityLabel',
          ],
        },
      ];

    case 'useRulerDateRangePicker':
      return [
        {
          id: 'selection',
          label: 'Hook Parameters',
          propNames: ['value.start', 'value.end', 'minSpanDays', 'maxSpanDays'],
        },
        {
          id: 'dimensions',
          label: 'Dimensions & Spacing',
          propNames: ['tickSpacing', 'rulerHeight'],
        },
        {
          id: 'colors',
          label: 'Theme & Highlight',
          propNames: [
            'theme.background',
            'theme.indicatorColor',
            'theme.accentColor',
            'theme.labelColor',
            'theme.rangeHighlightColor',
          ],
        },
      ];

    case 'RulerCompound':
      return [
        {
          id: 'selection',
          label: 'Root State',
          propNames: ['value', 'minDate', 'maxDate'],
        },
        {
          id: 'dimensions',
          label: 'Dimensions & Layout',
          propNames: [
            'tickSpacing',
            'tickWidth',
            'rulerHeight',
            'indicator.width',
            'indicator.height',
          ],
        },
        {
          id: 'colors',
          label: 'Theme & Accent',
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

    case 'RulerRangeCompound':
      return [
        {
          id: 'selection',
          label: 'Range Root State',
          propNames: ['value.start', 'value.end', 'minSpanDays', 'maxSpanDays'],
        },
        {
          id: 'dimensions',
          label: 'Dimensions & Layout',
          propNames: ['tickSpacing', 'rulerHeight'],
        },
        {
          id: 'colors',
          label: 'Theme & Range Styling',
          propNames: [
            'theme.background',
            'theme.indicatorColor',
            'theme.accentColor',
            'theme.labelColor',
            'theme.rangeHighlightColor',
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
