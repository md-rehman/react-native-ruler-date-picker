# react-native-ruler-date-picker

A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo. Powered by 60 FPS Reanimated 3 physics and dual-speed haptic feedback.

## ✨ Features

- **60 FPS Physics** — Reanimated 3 decay animations with snap-to-tick alignment
- **Dual-Speed Haptics** — Discrete ticks at slow scroll, continuous buzz at fast swipe
- **Windowed Rendering** — Only renders visible ticks + buffer for memory efficiency
- **Multi-Tier Rule-Based Graduations** — Declarative tick rules (`ticks="calendar"` | `"metric"` | `"minimal"` or custom rules array)
- **Compound Anatomy API** — Full layout flexibility with `Ruler.*` and `RulerRange.*`
- **Dark Mode Support** — Auto-detects system color scheme with custom theme palette override

## 📦 Installation

```bash
npm install react-native-ruler-date-picker
# or
yarn add react-native-ruler-date-picker
# or
pnpm add react-native-ruler-date-picker
```

### Peer Dependencies

Make sure you have these installed in your project:

```bash
npm install react-native-reanimated react-native-gesture-handler
```

Optional (for haptic feedback):

```bash
npx expo install expo-haptics
```

## 🚀 Quick Start

```tsx
import React, { useState } from 'react';
import { RulerDatePicker } from 'react-native-ruler-date-picker';

export default function App() {
  const [date, setDate] = useState(new Date());

  return (
    <RulerDatePicker
      value={date}
      onChange={(newDate, dateString) => {
        setDate(newDate);
        console.log('Selected:', dateString); // "2026-08-07"
      }}
      header={{ showResetToToday: true }}
    />
  );
}
```

## 📐 API Reference

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `value` | `Date \| string` | `undefined` | Currently selected date (controlled) |
| `defaultValue` | `Date \| string` | `today` | Initial selected date (uncontrolled) |
| `onChange` | `(date: Date, dateString: string) => void` | `undefined` | Called when selected date changes |
| `minDate` | `Date \| string` | `-365 days` | Minimum selectable date boundary |
| `maxDate` | `Date \| string` | `+365 days` | Maximum selectable date boundary |
| `locale` | `string` | `'default'` | BCP 47 locale for date formatting |
| `ticks` | `TickRule[] \| 'calendar' \| 'metric' \| 'minimal'` | `'calendar'` | Graduation rules or preset name |
| `tickSpacing` | `number` | `24` | Gap between tick centers (px) |
| `tickWidth` | `number` | `3` | Base thickness of tick bars (px) |
| `width` | `number` | `window width` | Viewport width of the ruler track (px) |
| `rulerHeight` | `number` | `60` | Ruler track viewport height (px) |
| `indicator` | `boolean \| IndicatorConfig` | `true` | Needle dimensions `{ width, height, alignment }` or custom renderer |
| `header` | `boolean \| HeaderConfig` | `true` | Header display, `{ showResetToToday, resetLabel, format }`, or custom renderer |
| `haptics` | `boolean \| HapticConfig` | `true` | Haptics toggle, `{ onTrigger }`, or velocity tuning |
| `theme` | `RulerTheme` | auto | Color tokens (`indicatorColor`, `background`, etc.) |
| `style` | `StyleProp<ViewStyle>` | `undefined` | Container view style (`height`, `margin`, etc.) |
| `lensEffect` | `boolean \| LensConfig` | `false` | Fisheye lens distortion magnifying center spacing |
| `accessibilityLabel` | `string` | `'Date picker'` | Accessibility label for screen readers |
| `debounceMs` | `number` | `100` | Debounce before firing `onChange` during scroll |

## 🎨 Theming

Colors auto-detect system light/dark mode. Provide custom tokens using `theme`:

```tsx
<RulerDatePicker
  value={date}
  onChange={setDate}
  theme={{
    background: '#0F172A',
    indicatorColor: '#38BDF8',
    accentColor: '#38BDF8',
    labelColor: '#F8FAFC',
    defaultTickColor: '#334155',
  }}
/>
```

## 📄 License

MIT © [Rehman](https://md-rehman.dev)