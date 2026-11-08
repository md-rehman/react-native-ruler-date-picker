# Changelog

All notable changes to `react-native-ruler-date-picker` will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [0.2.0] - 2026-11-08

### Added
- **`RulerDateRangePicker` & `useRulerDateRangePicker` (Experimental)**: Dual-handle horizontal date range selection with configurable `minSpanDays`, `maxSpanDays`, active handle tracking, and connected highlight strip.
- **Compound Anatomy Components**: Composable primitive subcomponents allowing full layout customization:
  - Single date: `RulerRoot`, `RulerHeader`, `RulerTrack`, `RulerIndicator`, `RulerTicks`, `RulerResetButton`.
  - Range date: `RulerRangeRoot`, `RulerRangeHeader`, `RulerRangeTrack`, `RulerRangeIndicator`, `RulerRangeHighlight`, `RulerRangeTicks`.
- **Custom Indicator Needle Rendering**: Added support for passing custom React elements as children directly inside `RulerIndicator` and `RulerRangeIndicator` (custom icons, badges, or pointers).
- **Headless Hooks**: `useRulerDatePicker` and `useRulerDateRangePicker` exposing gesture physics, velocity decay, snap calculations, tick windowing, and haptic triggers for custom UI.
- **Rule-Based Tick Graduation (`TickRule[]`)**: Declarative graduation rule system with built-in presets (`'calendar'`, `'metric'`, `'minimal'`) and condition predicates (`daily`, `weekly`, `monthly`, `{ dayOfWeek }`) with custom widths, heights, colors, dots, and label formatters.
- **Non-Linear Fisheye Lens Distortion (`lensEffect`)**: Optical magnification centered around the indicator needle with configurable `magnification`, `radius`, and `scaleTicks`.
- **2D Indicator Offset**: Replaced legacy alignment strings with `indicator.offset: [x, y]` coordinate offsets for needle positioning.
- **Internationalization (`locale`)**: BCP 47 locale formatting support across headers and graduation labels (e.g. `en-US`, `de-DE`, `ja-JP`).
- **Accessibility**: Screen reader support with `accessibilityLabel`, `accessibilityRole="adjustable"`, and increment/decrement accessibility actions.
- **Custom Experimental Badge & Icon**: Custom Erlenmeyer flask SVG icon with hover-expansion across documentation, interactive playground, and native Kitchensink app.
- **Comprehensive Documentation & Live Playground (`apps/docs`)**: Multi-page documentation routes, interactive playground with Monaco editor, live code AST synchronization, live in-situ `InlinePlayground` on guide pages, and code snippet generation.
- **Revamped Kitchensink App (`apps/kitchensink`)**: Full-screen Examples modal with backdrop dismiss, categorized multi-component preview, and dynamic light/dark theme adaptation directly on the canvas grid.

### Changed
- Standardized API on controlled `value` and `onChange` (accepting `Date | string` for single picker or `{ start, end }` for range picker).
- Consolidated theming tokens into a unified `theme` prop (`background`, `indicatorColor`, `accentColor`, `labelColor`, `defaultTickColor`, `rangeHighlightColor`).
- Marked range components and hooks with `@experimental` JSDoc annotations and visual badges.

### Fixed
- Bulletproof date normalization handling UTC boundaries, leap years, and daylight saving time (DST) transitions without hour drift.
- Web platform haptics fallback preventing crashes in web bundlers when `expo-haptics` is unavailable.
- Viewport content clipping in `RulerRoot` and track containers.
- Color hex input overflow and scrollbar alignment across playground and documentation panels.

### Removed
- Legacy `v0.1.0` prop aliases (`initialDate`, `onDateChange`, `tickColor`, `tickTallColor`, `labelInterval`) in favor of the unified `v0.2.0` API.
- Deprecated example apps replaced by `apps/docs` and `apps/kitchensink`.

---

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
