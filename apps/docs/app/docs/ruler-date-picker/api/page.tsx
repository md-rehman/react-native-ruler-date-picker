import React from 'react';
import type { Metadata } from 'next';
import {
  DocHeader,
  PropsTable,
  CodeBlock,
  DocPagination,
} from '../../../components/DocElements/DocElements';

export const metadata: Metadata = {
  title: 'RulerDatePicker - API Reference | react-native-ruler-date-picker',
  description: 'Complete props table, types, defaults, and callback signatures for RulerDatePicker.',
};

export default function RulerDatePickerApiPage() {
  const currentHref = '/docs/ruler-date-picker/api';

  const rulerProps = [
    {
      name: 'value',
      type: 'Date | string',
      default: 'new Date() (Today)',
      description: 'Currently selected date (controlled mode). Accepts a JavaScript Date object or "YYYY-MM-DD" formatted string.',
    },
    {
      name: 'defaultValue',
      type: 'Date | string',
      default: 'new Date() (Today)',
      description: 'Initial selected date for uncontrolled mode.',
    },
    {
      name: 'onChange',
      type: '(date: Date, dateString: string) => void',
      default: '-',
      description: 'Callback invoked when scrolling stops and snaps to a date, returning both the Date object and "YYYY-MM-DD" string.',
    },
    {
      name: 'minDate',
      type: 'Date | string',
      default: 'Today - 365 days',
      description: 'Earliest selectable boundary date. The ruler clamps scroll bounds and ticks to this date.',
    },
    {
      name: 'maxDate',
      type: 'Date | string',
      default: 'Today + 365 days',
      description: 'Latest selectable boundary date. The ruler clamps scroll bounds and ticks to this date.',
    },
    {
      name: 'locale',
      type: 'string',
      default: "'default'",
      description: 'BCP 47 language tag (e.g. "en-US", "de-DE", "ja-JP") for native localized weekday and month names.',
    },
    {
      name: 'ticks',
      type: "'calendar' | 'metric' | 'minimal' | TickRule[]",
      default: "'calendar'",
      description: 'Graduation tick mark preset name or custom array of declarative tick rules evaluated top-to-bottom.',
    },
    {
      name: 'tickSpacing',
      type: 'number',
      default: '24',
      description: 'Horizontal distance in pixels between consecutive tick graduation marks.',
    },
    {
      name: 'tickWidth',
      type: 'number',
      default: '3',
      description: 'Base thickness in pixels for tick graduation bars.',
    },
    {
      name: 'width',
      type: 'number',
      default: 'Window width',
      description: 'Viewport track width in pixels. Defaults to device window dimensions width.',
    },
    {
      name: 'rulerHeight',
      type: 'number',
      default: '60',
      description: 'Height in pixels of the interactive ruler tick viewport track.',
    },
    {
      name: 'header',
      type: 'boolean | HeaderConfig',
      default: 'true',
      description: 'Toggle the top date display header, or pass a HeaderConfig object to customize format, styles, or render.',
    },
    {
      name: 'indicator',
      type: 'boolean | IndicatorConfig',
      default: 'true',
      description: 'Toggle the center selection needle pointer, or pass an IndicatorConfig object to customize appearance.',
    },
    {
      name: 'haptics',
      type: 'boolean | HapticConfig',
      default: 'true',
      description: 'Enable dual-speed tactile vibration feedback or customize trigger callback.',
    },
    {
      name: 'lensEffect',
      type: 'boolean | LensConfig',
      default: 'false',
      description: 'Enable non-linear optical fisheye lens distortion where tick spacing is magnified near center.',
    },
    {
      name: 'theme',
      type: 'RulerTheme',
      default: 'auto (system)',
      description: 'Custom theme tokens overriding default Light/Dark color scheme.',
    },
    {
      name: 'debounceMs',
      type: 'number',
      default: '100',
      description: 'Debounce duration in milliseconds for onChange events during rapid continuous scrolling.',
    },
    {
      name: 'style',
      type: 'StyleProp<ViewStyle>',
      default: '-',
      description: 'Custom styles applied to the outer root container view.',
    },
    {
      name: 'testID',
      type: 'string',
      default: '-',
      description: 'Identifier for automated testing and element inspection.',
    },
    {
      name: 'accessibilityLabel',
      type: 'string',
      default: "'Date picker'",
      description: 'Screen reader accessibility label for assistive technologies (VoiceOver & TalkBack).',
    },
  ];

  const indicatorProps = [
    {
      name: 'width',
      type: 'number',
      default: '2',
      description: 'Width of the center needle pointer in pixels.',
    },
    {
      name: 'height',
      type: 'number',
      default: '40',
      description: 'Height of the center needle pointer in pixels.',
    },
    {
      name: 'color',
      type: 'string',
      default: 'theme.indicatorColor',
      description: 'Color of the center needle pointer.',
    },
    {
      name: 'alignment',
      type: "'bottom' | 'center' | 'top'",
      default: "'bottom'",
      description: 'Vertical alignment of the center needle pointer inside the track.',
    },
    {
      name: 'style',
      type: 'StyleProp<ViewStyle>',
      default: '-',
      description: 'Style overrides applied directly to the indicator view.',
    },
    {
      name: 'render',
      type: '() => React.ReactNode',
      default: '-',
      description: 'Custom React element renderer replacing the default needle pointer.',
    },
  ];

  const headerProps = [
    {
      name: 'showResetToToday',
      type: 'boolean',
      default: 'false',
      description: 'Show "Today" quick reset pill button when scrolled away from today.',
    },
    {
      name: 'resetLabel',
      type: 'string',
      default: "'Today'",
      description: 'Text label displayed on the reset button.',
    },
    {
      name: 'format',
      type: '(date: Date) => string',
      default: '-',
      description: 'Custom date format function for the header text (overrides default localized weekday, month, day).',
    },
    {
      name: 'dateStyle',
      type: 'StyleProp<TextStyle>',
      default: '-',
      description: 'Style overrides for header date label text.',
    },
    {
      name: 'yearStyle',
      type: 'StyleProp<TextStyle>',
      default: '-',
      description: 'Style overrides for header year label text.',
    },
    {
      name: 'style',
      type: 'StyleProp<ViewStyle>',
      default: '-',
      description: 'Style overrides for header container view.',
    },
    {
      name: 'render',
      type: '(selectedDate: Date, isToday: boolean, resetToToday: () => void) => React.ReactNode',
      default: '-',
      description: 'Custom header component renderer completely replacing the default header.',
    },
  ];

  const lensProps = [
    {
      name: 'magnification',
      type: 'number',
      default: '1.6',
      description: 'Tick spacing expansion factor at the center needle (1.6 = 60% wider).',
    },
    {
      name: 'radius',
      type: 'number',
      default: '60',
      description: 'Pixel radius around center needle over which magnification decays back to linear spacing.',
    },
    {
      name: 'scaleTicks',
      type: 'boolean',
      default: 'true',
      description: 'Whether tick graduation bar heights also scale dynamically with lens distortion.',
    },
  ];

  const hapticProps = [
    {
      name: 'enabled',
      type: 'boolean',
      default: 'true',
      description: 'Whether tactile haptic vibrations are enabled.',
    },
    {
      name: 'onTrigger',
      type: "(mode: 'tick' | 'continuous') => void",
      default: '-',
      description: 'Custom haptic vibration callback (e.g. for Expo Haptics or custom device drivers).',
    },
    {
      name: 'fastSwipeTickThreshold',
      type: 'number',
      default: '1',
      description: 'Scroll speed threshold (ticks/frame) to switch from discrete tick pulses to continuous buzz mode.',
    },
    {
      name: 'continuousHapticIntervalMs',
      type: 'number',
      default: '20',
      description: 'Pulse interval in milliseconds during continuous haptic buzz mode.',
    },
  ];

  const themeProps = [
    {
      name: 'background',
      type: 'string',
      default: "'transparent'",
      description: 'Component background color token.',
    },
    {
      name: 'indicatorColor',
      type: 'string',
      default: '#3B82F6 (Light) / #60A5FA (Dark)',
      description: 'Center indicator pointer needle color.',
    },
    {
      name: 'accentColor',
      type: 'string',
      default: '#3B82F6 (Light) / #60A5FA (Dark)',
      description: 'Primary accent color for today indicator badge and active elements.',
    },
    {
      name: 'labelColor',
      type: 'string',
      default: '#6B7280 (Light) / #9CA3AF (Dark)',
      description: 'Color of date and year label text.',
    },
    {
      name: 'defaultTickColor',
      type: 'string',
      default: '#D1D5DB (Light) / #4B5563 (Dark)',
      description: 'Base color for unstyled graduation tick marks.',
    },
    {
      name: 'rangeHighlightColor',
      type: 'string',
      default: 'rgba(59, 130, 246, 0.15) (Light) / rgba(96, 165, 250, 0.2) (Dark)',
      description: 'Color for range selection connecting bar in range mode.',
    },
  ];

  return (
    <div>
      <DocHeader
        category="RulerDatePicker"
        badge="#api"
        title="API Reference"
        description="Comprehensive props reference, type definitions, and callback parameters for <RulerDatePicker />."
      />

      <section style={{ marginBottom: 40 }}>
        <h2>Props Reference Table</h2>
        <PropsTable data={rulerProps} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>Subcomponent Configurations</h2>

        <h3 style={{ marginTop: 24, marginBottom: 12 }}>IndicatorConfig</h3>
        <p>Passed to the <code>indicator</code> prop to customize the center needle pointer:</p>
        <PropsTable data={indicatorProps} />

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>HeaderConfig</h3>
        <p>Passed to the <code>header</code> prop to customize the top date header:</p>
        <PropsTable data={headerProps} />

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>LensConfig</h3>
        <p>Passed to the <code>lensEffect</code> prop to configure optical fisheye magnification:</p>
        <PropsTable data={lensProps} />

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>HapticConfig</h3>
        <p>Passed to the <code>haptics</code> prop to configure dual-speed vibration feedback:</p>
        <PropsTable data={hapticProps} />

        <h3 style={{ marginTop: 32, marginBottom: 12 }}>RulerTheme</h3>
        <p>Passed to the <code>theme</code> prop to customize color scheme tokens:</p>
        <PropsTable data={themeProps} />
      </section>

      <section style={{ marginBottom: 40 }}>
        <h2>TypeScript Interfaces</h2>
        <p>
          Key TypeScript interfaces exported from the package for <code>RulerDatePicker</code>:
        </p>

        <CodeBlock
          title="types.ts"
          language="typescript"
          code={`export interface RulerDatePickerProps {
  // Value & Selection
  value?: Date | string;
  defaultValue?: Date | string;
  onChange?: (date: Date, dateString: string) => void;
  minDate?: Date | string;
  maxDate?: Date | string;
  locale?: string;

  // Tick Configuration
  ticks?: TickRule[] | 'calendar' | 'metric' | 'minimal';
  tickSpacing?: number;
  tickWidth?: number;

  // Dimensions & Theming
  width?: number;
  rulerHeight?: number;
  theme?: RulerTheme;
  style?: StyleProp<ViewStyle>;

  // Indicator, Header, & Haptics
  indicator?: boolean | IndicatorConfig;
  header?: boolean | HeaderConfig;
  haptics?: boolean | HapticConfig;

  // Fisheye Lens Effect
  lensEffect?: boolean | LensConfig;

  // Performance
  debounceMs?: number;

  testID?: string;
  accessibilityLabel?: string;
}`}
        />
      </section>

      <DocPagination currentHref={currentHref} />
    </div>
  );
}
