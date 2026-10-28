export type ComponentType =
  | 'RulerDatePicker'
  | 'RulerDateRangePicker'
  | 'RulerCompound'
  | 'RulerRangeCompound'
  | 'useRulerDatePicker'
  | 'useRulerDateRangePicker';

export interface ExamplePreset {
  id: string;
  name: string;
  description: string;
  componentType: ComponentType;
  badge?: string;
  props: Record<string, any>;
}

export interface ExampleSection {
  id: string;
  title: string;
  componentType: ComponentType;
  badge?: string;
  items: ExamplePreset[];
}

const getTodayStr = () => new Date().toISOString().split('T')[0];
const getFutureDateStr = (days: number) =>
  new Date(Date.now() + days * 86400000).toISOString().split('T')[0];

export const EXAMPLE_SECTIONS: ExampleSection[] = [
  {
    id: 'ruler-date-picker',
    title: 'RulerDatePicker',
    componentType: 'RulerDatePicker',
    badge: '#single',
    items: [
      {
        id: 'sunset-amber',
        name: 'Sunset Amber',
        description: 'Signature warm dark grey with glowing amber accents',
        componentType: 'RulerDatePicker',
        badge: '#signature',
        props: {
          ticks: 'calendar',
          tickSpacing: 26,
          rulerHeight: 60,
          indicator: { width: 2, height: 40 },
          header: true,
          haptics: true,
          theme: {
            background: '#18181B',
            indicatorColor: '#F59E0B',
            accentColor: '#F59E0B',
            labelColor: '#FAFAFA',
            defaultTickColor: '#3F3F46',
          },
        },
      },
      {
        id: 'calendar-custom-rules',
        name: 'Custom Tick Rules (4 Tiers)',
        description: 'Bespoke multi-tier rules with weekend amber highlights and custom labels',
        componentType: 'RulerDatePicker',
        badge: '#rules',
        props: {
          ticks: [
            {
              condition: 'monthly',
              height: 32,
              width: 4,
              color: '#38BDF8',
              label: {
                color: '#38BDF8',
                fontWeight: 'bold',
              },
            },
            {
              condition: 'weekly',
              height: 24,
              width: 3,
              color: '#818CF8',
              label: true,
            },
            {
              condition: { dayOfWeek: [0, 6] },
              height: 18,
              width: 2.5,
              color: '#F59E0B',
            },
            {
              condition: 'daily',
              height: 12,
              width: 2,
              color: '#3F3F46',
            },
          ],
          tickSpacing: 26,
          rulerHeight: 65,
          indicator: { width: 2, height: 40 },
          header: { showResetToToday: true },
          haptics: true,
          theme: {
            background: '#18181D',
            indicatorColor: '#38BDF8',
            accentColor: '#38BDF8',
            labelColor: '#F4F4F5',
            defaultTickColor: '#3F3F46',
          },
        },
      },
      {
        id: 'lens-distortion',
        name: 'Lens Distortion Effect',
        description: 'Non-linear fisheye optical magnification centered on needle pointer',
        componentType: 'RulerDatePicker',
        badge: '⚡ Fisheye',
        props: {
          ticks: 'calendar',
          tickSpacing: 22,
          rulerHeight: 64,
          lensEffect: {
            magnification: 1.8,
            radius: 3,
            scaleTicks: false,
          },
          indicator: { width: 2, height: 42 },
          header: { showResetToToday: true },
          haptics: true,
          theme: {
            background: '#15171E',
            indicatorColor: '#38BDF8',
            accentColor: '#38BDF8',
            labelColor: '#F8FAFC',
            defaultTickColor: '#334155',
          },
        },
      },
      {
        id: 'compact-minimal',
        name: 'Compact Minimal (Card / Sheet)',
        description: 'Low-profile 46px compact ruler for cards and bottom sheets',
        componentType: 'RulerDatePicker',
        badge: '#minimal',
        props: {
          ticks: 'calendar',
          tickSpacing: 18,
          rulerHeight: 46,
          indicator: { width: 2, height: 28, offset: [0, 0] },
          header: false,
          haptics: true,
          theme: {
            background: '#1A1A1E',
            indicatorColor: '#A78BFA',
            accentColor: '#A78BFA',
            labelColor: '#F4F4F5',
            defaultTickColor: '#3F3F46',
          },
        },
      },
    ],
  },
  {
    id: 'ruler-date-range-picker',
    title: 'RulerDateRangePicker',
    componentType: 'RulerDateRangePicker',
    badge: '#range',
    items: [
      {
        id: 'range-standard',
        name: 'Standard Date Range',
        description: 'Dual handles with connecting highlight strip and 2 to 14-day span limits',
        componentType: 'RulerDateRangePicker',
        badge: '#range',
        props: {
          value: {
            start: getTodayStr(),
            end: getFutureDateStr(7),
          },
          minSpanDays: 2,
          maxSpanDays: 14,
          tickSpacing: 26,
          rulerHeight: 64,
          haptics: true,
          highlight: true,
          theme: {

            background: '#1A1A1E',
            indicatorColor: '#A78BFA',
            accentColor: '#A78BFA',
            labelColor: '#F4F4F5',
            defaultTickColor: '#3F3F46',
            rangeHighlightColor: 'rgba(167, 139, 250, 0.22)',
          },
        },
      },
      {
        id: 'range-vacation',
        name: 'Vacation Booking (Amber)',
        description: 'Hospitality-style booking interval with min 3-night requirement and warm theme',
        componentType: 'RulerDateRangePicker',
        badge: '#booking',
        props: {
          value: {
            start: getTodayStr(),
            end: getFutureDateStr(5),
          },
          minSpanDays: 3,
          maxSpanDays: 30,
          tickSpacing: 25,
          rulerHeight: 66,
          haptics: true,
          highlight: true,
          theme: {
            background: '#18181B',
            indicatorColor: '#F59E0B',
            accentColor: '#F59E0B',
            labelColor: '#FAFAFA',
            defaultTickColor: '#3F3F46',
            rangeHighlightColor: 'rgba(245, 158, 11, 0.22)',
          },
        },
      },
      {
        id: 'range-metric',
        name: 'Metric Range Graduation',
        description: 'Range picker powered by 3-tier metric graduation scale',
        componentType: 'RulerDateRangePicker',
        badge: '#metric',
        props: {
          value: {
            start: getTodayStr(),
            end: getFutureDateStr(10),
          },
          ticks: 'metric',
          minSpanDays: 1,
          maxSpanDays: 20,
          tickSpacing: 22,
          rulerHeight: 60,
          haptics: true,
          highlight: true,
          theme: {
            background: '#17191E',
            indicatorColor: '#10B981',
            accentColor: '#10B981',
            labelColor: '#ECFDF5',
            defaultTickColor: '#334155',
            rangeHighlightColor: 'rgba(16, 185, 129, 0.22)',
          },
        },
      },
    ],
  },
  {
    id: 'compound-components',
    title: 'Compound Anatomy',
    componentType: 'RulerCompound',
    badge: '#compound',
    items: [
      {
        id: 'compound-single',
        name: 'Ruler (Single Compound)',
        description: 'Composable Ruler.Root, Track, Indicator, Header, & ResetButton hierarchy',
        componentType: 'RulerCompound',
        badge: '#anatomy',
        props: {
          tickSpacing: 26,
          rulerHeight: 64,
          haptics: true,
          theme: {
            background: '#111827',
            indicatorColor: '#38BDF8',
            accentColor: '#38BDF8',
            labelColor: '#F3F4F6',
            defaultTickColor: '#374151',
          },
        },
      },
      {
        id: 'compound-range',
        name: 'RulerRange (Range Compound)',
        description: 'Composable RulerRange.Root, Track, Highlight, & Indicator dual subcomponents',
        componentType: 'RulerRangeCompound',
        badge: '#anatomy',
        props: {
          value: {
            start: getTodayStr(),
            end: getFutureDateStr(6),
          },
          minSpanDays: 2,
          maxSpanDays: 14,
          tickSpacing: 26,
          rulerHeight: 64,
          haptics: true,
          theme: {
            background: '#18181B',
            indicatorColor: '#F59E0B',
            accentColor: '#F59E0B',
            labelColor: '#FAFAFA',
            defaultTickColor: '#3F3F46',
            rangeHighlightColor: 'rgba(245, 158, 11, 0.25)',
          },
        },
      },
    ],
  },
  {
    id: 'headless-hooks',
    title: 'Headless Hooks',
    componentType: 'useRulerDatePicker',
    badge: '#headless',
    items: [
      {
        id: 'hook-single',
        name: 'useRulerDatePicker',
        description: 'Headless single-date physics, gesture binding, velocity decay, and custom UI',
        componentType: 'useRulerDatePicker',
        badge: '#headless',
        props: {
          tickSpacing: 24,
          rulerHeight: 56,
          theme: {
            background: '#131722',
            indicatorColor: '#38BDF8',
            accentColor: '#38BDF8',
            labelColor: '#F8FAFC',
            defaultTickColor: '#334155',
          },
        },
      },
      {
        id: 'hook-range',
        name: 'useRulerDateRangePicker',
        description: 'Headless dual-handle range tracking, active handle indicator, & span days',
        componentType: 'useRulerDateRangePicker',
        badge: '#headless',
        props: {
          value: {
            start: getTodayStr(),
            end: getFutureDateStr(5),
          },
          minSpanDays: 2,
          maxSpanDays: 20,
          tickSpacing: 24,
          rulerHeight: 56,
          theme: {
            background: '#161924',
            indicatorColor: '#10B981',
            accentColor: '#10B981',
            labelColor: '#F1F5F9',
            defaultTickColor: '#334155',
            rangeHighlightColor: 'rgba(16, 185, 129, 0.22)',
          },
        },
      },
    ],
  },
];

// Flat list for easy lookup by ID
export const EXAMPLES: ExamplePreset[] = EXAMPLE_SECTIONS.flatMap((sec) => sec.items);
