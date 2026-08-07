# react-native-ruler-date-picker

A performant, customizable ruler-style date picker for React Native.

<!-- TODO: Add hero GIF/video here -->

## ✨ Features

- **60 FPS Physics** — Reanimated 3 decay animations with snap-to-tick alignment
- **Dual-Speed Haptics** — Discrete ticks at slow scroll, continuous buzz at fast swipe
- **Windowed Rendering** — Only renders visible ticks + buffer for memory efficiency
- **Fully Customizable** — Every dimension, color, and behavior is configurable via props
- **Graceful Haptics** — Works with `expo-haptics`, custom handlers, or silently without either
- **Dark Mode Support** — Auto-detects system color scheme with manual override

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
import { RulerDatePicker } from 'react-native-ruler-date-picker';

export default function App() {
  const [date, setDate] = useState(new Date());

  return (
    <RulerDatePicker
      selectedDate={date}
      onSelectDate={(newDate, dateString) => {
        setDate(newDate);
        console.log('Selected:', dateString); // "2026-08-07"
      }}
    />
  );
}
```

## 📐 API Reference

### Props

| Prop | Type | Default | Description |
|---|---|---|---|
| `selectedDate` | `Date \| string` | **required** | Currently selected date |
| `onSelectDate` | `(date: Date, dateString: string) => void` | **required** | Called when date changes |
| `minDate` | `Date` | -365 days | Minimum scrollable date |
| `maxDate` | `Date` | +365 days | Maximum scrollable date |
| `labelInterval` | `'daily' \| 'weekly' \| 'monthly' \| (date: Date) => boolean` | `'weekly'` | Which ticks show labels |
| `highlightDays` | `number[]` | — | Days of week to highlight (0=Sun, 6=Sat) |
| `tickSpacing` | `number` | `24` | Gap between ticks (px) |
| `tickHeight` | `number` | `12` | Small tick height (px) |
| `tickTallHeight` | `number` | `24` | Large/labeled tick height (px) |
| `tickThickness` | `number` | `4` | Tick bar width (px) |
| `tickColor` | `string` | auto | Small tick color |
| `tickTallColor` | `string` | auto | Large tick color (falls back to `tickColor`) |
| `labelColor` | `string` | auto | Label text color |
| `accentColor` | `string` | auto | Today dot & reset button color |
| `indicatorColor` | `string` | auto | Center indicator line color |
| `backgroundColor` | `string` | `transparent` | Component background |
| `height` | `number` | `120` | Total component height (px) |
| `rulerHeight` | `number` | `60` | Ruler track height (px) |
| `indicatorWidth` | `number` | `2` | Center indicator width (px) |
| `indicatorHeight` | `number` | `40` | Center indicator height (px) |
| `todayDotSize` | `number` | `6` | Today dot diameter (px) |
| `labelFontSize` | `number` | `10` | Tick label font size (px) |
| `bufferTicks` | `number` | `10` | Off-screen render buffer |
| `updateDebounceMs` | `number` | `100` | Debounce for `onSelectDate` (ms) |
| `enableHaptics` | `boolean` | `true` | Enable/disable haptic feedback |
| `onHapticTrigger` | `(mode: 'tick' \| 'continuous') => void` | — | Custom haptic handler |
| `fastSwipeTickThreshold` | `number` | `1` | Ticks/frame to trigger fast mode |
| `continuousHapticIntervalMs` | `number` | `20` | Continuous haptic pulse interval (ms) |
| `showResetToToday` | `boolean` | `false` | Show "Today" reset button |
| `renderHeader` | `(date, isToday, resetFn) => ReactNode` | — | Custom header renderer |

## 🎨 Theming

Colors auto-detect the system color scheme. Override any color individually:

```tsx
<RulerDatePicker
  selectedDate={new Date()}
  onSelectDate={handleSelect}
  tickColor="#E5E7EB"
  tickTallColor="#6366F1"
  accentColor="#8B5CF6"
  indicatorColor="#8B5CF6"
  labelColor="#A1A1AA"
  backgroundColor="#18181B"
/>
```

## 🤝 Contributing

See the [ROADMAP](./ROADMAP.md) for planned features and development phases.

1. Clone the repo
2. Install dependencies: `pnpm install`
3. Start the example app: `pnpm dev`

## 📄 License

MIT © [Rehman](https://md-rehman.dev)