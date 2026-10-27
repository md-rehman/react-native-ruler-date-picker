export interface ExamplePreset {
  id: string;
  name: string;
  description: string;
  props: Record<string, any>;
}

export const EXAMPLES: ExamplePreset[] = [
  {
    id: 'sunset-amber',
    name: 'Sunset Amber',
    description: 'Signature warm dark grey with glowing amber accents',
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
    id: 'nordic-frost',
    name: 'Nordic Frost',
    description: 'Crisp arctic slate with frosty sky blue accents',
    props: {
      ticks: 'calendar',
      tickSpacing: 24,
      rulerHeight: 60,
      indicator: { width: 2, height: 40 },
      header: { showResetToToday: true },
      haptics: true,
      theme: {
        background: '#161922',
        indicatorColor: '#38BDF8',
        accentColor: '#38BDF8',
        labelColor: '#F8FAFC',
        defaultTickColor: '#334155',
      },
    },
  },
  {
    id: 'metric-timeline',
    name: 'Metric Graduation (3 Tiers)',
    description: 'Precision metric ruler hierarchy (10-day, 5-day, and daily ticks)',
    props: {
      ticks: 'metric',
      tickSpacing: 22,
      rulerHeight: 60,
      indicator: { width: 2, height: 40 },
      header: { showResetToToday: true },
      haptics: true,
      theme: {
        background: '#17191E',
        indicatorColor: '#38BDF8',
        accentColor: '#38BDF8',
        labelColor: '#E2E8F0',
        defaultTickColor: '#334155',
      },
    },
  },
  {
    id: 'calendar-custom-rules',
    name: 'Custom Tick Rules (4 Tiers)',
    description: 'Bespoke multi-tier rules with weekend amber highlights and custom labels',
    props: {
      ticks: [
        {
          condition: 'monthly',
          height: 32,
          width: 4,
          color: '#38BDF8',
          label: {
            format: (d: Date) => d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
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
    id: 'compact-minimal',
    name: 'Compact Minimal (Card / Sheet)',
    description: 'Low-profile 46px compact ruler for cards and bottom sheets',
    props: {
      ticks: 'calendar',
      tickSpacing: 18,
      rulerHeight: 46,
      indicator: { width: 2, height: 28, alignment: 'top' },
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
];
