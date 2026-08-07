# Changelog

All notable changes to `react-native-ruler-date-picker` will be documented in this file.

## [0.1.0] - 2026-08-07

### Added
- Extracted `DateRulerV3` from companion-expo into standalone open-source monorepo.
- 60 FPS Reanimated 3 decay animations with snap-to-tick alignment.
- Dual-speed haptics engine (discrete tick impact vs continuous pulse interval).
- Windowed tick rendering with configurable off-screen `bufferTicks`.
- Independent color styling for small (`tickColor`) vs large (`tickTallColor`) ticks.
- Configurable `labelInterval` (`'daily'`, `'weekly'`, `'monthly'`, or custom callback).
- Dynamic date range clamping via `minDate` and `maxDate` props.
- Graceful `expo-haptics` fallback with custom `onHapticTrigger` override support.
- Fully exposed layout dimensions (`height`, `rulerHeight`, `indicatorWidth`, `indicatorHeight`, `todayDotSize`, `labelFontSize`).
- Expo Example App (`apps/example`), Storybook App (`apps/storybook`), Kitchensink App (`apps/kitchensink`), and Fumadocs Site (`apps/docs`).
