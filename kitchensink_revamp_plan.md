# Kitchensink Revamp Plan

## Goal
Redesign the Expo-based kitchensink app (React Native) to mirror the visual language and interaction patterns of the Next.js demo app, adapted for mobile. The current kitchensink is a monolithic 429-line `App.tsx` with hardcoded presets. The new version will be a sophisticated glass-morphism playground with draggable modals, theme switching, and a centralized picker preview.

---

## Current State

### Demo App (Next.js web) — the reference
- Glass-morphism design system with CSS custom properties
- `FloatingModal` — draggable, dockable modals with snap-to-edge & collapse
- `TopBar` — header with `DeviceSelector`, `ModalToggle`, `GlassControls`, `ThemeToggle`
- `CentralView` — grid background + `DeviceMockup` wrapping `ComponentPreview`
- `ExamplesPanel` — preset list in a floating modal on the left
- Property modals (Selection, Dimensions, Colors, Features) as separate floating modals

### Kitchensink App (Expo RN) — what we're redesigning
- Single-file `App.tsx` (429 lines) — monolithic
- 3 hardcoded tabs: Fitness, Events, Builder
- No glass styling, no draggable modals, no theme toggle
- No component decomposition

---

## Architecture: New Kitchensink

### Layout Overview

```
┌─────────────────────────────────────────┐
│  Header (TopBar)                        │
│  [☰ Nav] ── [Glass] [Modals] [Theme]   │
├─────────────────────────────────────────┤
│                                         │
│  · · · · · · · · · · · · · · · · · · · │
│  · · · ┌───────────────────┐ · · · · · │
│  · · · │  Date Display     │ · · · · · │
│  · · · │                   │ · · · · · │
│  · · · │  RulerDatePicker  │ · · · · · │
│  · · · │  (centered)       │ · · · · · │
│  · · · └───────────────────┘ · · · · · │
│  · · · · · · · · · · · · · · · · · · · │
│                                         │
│ ┌──────────┐           ┌──────────┐    │
│ │ Examples │           │ Selection│    │
│ │ (docked  │           │ (docked  │    │
│ │  left)   │           │  right)  │    │
│ └──────────┘           └──────────┘    │
└─────────────────────────────────────────┘
```

### Key Differences from Demo App
- **No `DeviceSelector`** or `DeviceMockup` — the `RulerDatePicker` renders directly at center
- **Examples modal** is toggled by a dedicated **☰ nav button** on the **left side** of the header — starts **docked left**
- **Property modals** (Selection, Dimensions, Colors, Features) start **docked right** by default
- All modals are glass-styled, draggable via `PanResponder`, and snap/collapse to screen edges
- **Subtle grid/dot background pattern** behind the picker (matching demo's `gridBackground`)
- **`reanimated-color-picker`** for mobile-native color picking (replaces `<input type="color">`)
- `expo-blur` for glass-morphism (`BlurView`); graceful semi-transparent fallback on Android is acceptable

---

## Component Breakdown

### File Structure

```
apps/kitchensink/
├── App.tsx                      (entry: GestureHandlerRootView → ThemeProvider → AppShell)
├── components/
│   ├── AppShell.tsx             (main layout orchestrator)
│   ├── TopBar.tsx               (header bar)
│   ├── GlassView.tsx            (reusable glass container — BlurView wrapper)
│   ├── FloatingModal.tsx        (draggable modal with snap & dock)
│   ├── ComponentPreview.tsx     (centered picker + date display)
│   ├── GridBackground.tsx       (subtle dot/grid pattern view)
│   ├── ExamplesPanel.tsx        (preset list)
│   ├── ExampleListItem.tsx      (single preset card)
│   ├── ModalToggle.tsx          (category toggle icon buttons + reset)
│   ├── GlassControls.tsx        (alpha/blur cycling buttons)
│   ├── ThemeToggle.tsx          (light/dark switch button)
│   ├── NavToggle.tsx            (☰ hamburger button — toggles Examples modal)
│   └── PropControl/
│       ├── PropControl.tsx      (composite: label + delegated control)
│       ├── BooleanToggle.tsx    (RN Switch)
│       ├── ColorPicker.tsx      (reanimated-color-picker wheel/slider)
│       ├── NumberInput.tsx      (TextInput with number keyboard)
│       └── EnumSelect.tsx       (row of TouchableOpacity pills)
├── context/
│   └── ThemeContext.tsx          (theme + glass state provider)
├── data/
│   ├── examples.ts              (preset definitions — copied from demo)
│   └── propDefinitions.ts       (prop metadata — copied from demo)
├── hooks/
│   └── usePickerProps.ts        (preset/prop state management — copied from demo)
└── theme/
    └── tokens.ts                (design tokens: colors, spacing, radii, glass defaults)
```

### Component → Responsibility Matrix

| # | Component | Demo Equivalent | RN Adaptation Notes |
|---|-----------|----------------|---------------------|
| 1 | `ThemeContext` | `context/ThemeContext.tsx` | `AsyncStorage` replaces `localStorage`; stores glass alpha/blur too (no CSS vars in RN) |
| 2 | `GlassView` | `styles/glass.css` | `expo-blur` `BlurView` wrapper; consumes `glassAlpha`/`glassBlur` from context; shared border/shadow styling |
| 3 | `FloatingModal` | `FloatingModal/` | `PanResponder` + `Animated.ValueXY` replaces pointer events; same snap/dock/collapse logic |
| 4 | `TopBar` | `TopBar/` | Same flex layout; left: `NavToggle`; right: `GlassControls` + `ModalToggle` + `ThemeToggle` |
| 5 | `NavToggle` | *(new)* | Simple hamburger icon `TouchableOpacity` — toggles Examples modal visibility |
| 6 | `ModalToggle` | `ModalToggle/` | Same 4 category icons + reset; ported to RN SVG via `react-native-svg` |
| 7 | `GlassControls` | `GlassControls/` | Same alpha/blur cycling; updates `ThemeContext` instead of CSS vars |
| 8 | `ThemeToggle` | `ThemeToggle/` | Sun/Moon icon; same toggle logic |
| 9 | `ExamplesPanel` | `ExamplesPanel/` | `ScrollView` of `ExampleListItem`s |
| 10 | `ExampleListItem` | `ExampleListItem/` | `TouchableOpacity` card with name + description |
| 11 | `ComponentPreview` | `ComponentPreview/` | Simplified — no device mockup; date text + `RulerDatePicker` centered |
| 12 | `GridBackground` | CSS `gridBackground` | RN `View` with repeated thin lines or dots via absolute-positioned elements |
| 13 | `PropControl/*` | `PropControl/*` | `ColorPicker` uses `reanimated-color-picker`; rest are straightforward ports |
| 14 | `AppShell` | `AppShell/` | Orchestrates: manages modal visibility, renders all components |

### Data & Hooks (unchanged from demo)

| File | Notes |
|------|-------|
| `data/examples.ts` | 5 presets — direct copy |
| `data/propDefinitions.ts` | Prop metadata for Selection, Dimensions, Colors, Features — direct copy |
| `hooks/usePickerProps.ts` | `useState` + `useCallback` for preset/prop management — direct copy |

---

## Detailed Implementation Steps

### Phase 1: Project Scaffolding & Design Tokens

**Files created:** `theme/tokens.ts`, folder structure

- Create the folder structure listed above
- Define `theme/tokens.ts` — central design tokens matching demo's CSS variables:

```ts
// theme/tokens.ts
export const COLORS = {
  light: {
    bg: '#F5F5F7',
    surface: 'rgba(255, 255, 255, 0.6)',
    surfaceHover: 'rgba(255, 255, 255, 0.8)',
    textPrimary: '#1D1D1F',
    textSecondary: '#6E6E73',
    textMuted: '#AEAEB2',
    accent: '#007AFF',
    border: '#E5E5EA',
    glassBorderColor: 'rgba(255, 255, 255, 0.25)',
    glassBgRgb: '255, 255, 255',
  },
  dark: {
    bg: '#1C1C1E',
    surface: 'rgba(44, 44, 46, 0.6)',
    surfaceHover: 'rgba(44, 44, 46, 0.8)',
    textPrimary: '#F5F5F7',
    textSecondary: '#A1A1A6',
    textMuted: '#636366',
    accent: '#0A84FF',
    border: '#38383A',
    glassBorderColor: 'rgba(255, 255, 255, 0.08)',
    glassBgRgb: '44, 44, 46',
  },
};

export const SPACING = { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 };
export const RADII = { sm: 8, md: 12, lg: 16, xl: 24 };
export const GLASS_DEFAULTS = { alpha: 0.25, blur: 5 };
export const TOPBAR_HEIGHT = 56;
```

---

### Phase 2: Context & Data Layer

**Files created:** `context/ThemeContext.tsx`, `data/examples.ts`, `data/propDefinitions.ts`, `hooks/usePickerProps.ts`

1. **Port `ThemeContext.tsx`** — adapted for RN:
   - Uses `AsyncStorage` for persistence of theme preference, glass alpha, glass blur
   - Provides: `theme`, `toggleTheme`, `colors` (resolved from tokens), `glassAlpha`, `glassBlur`, `setGlassAlpha`, `setGlassBlur`, `resetGlass`
   - Glass state lives in context (since no CSS variables in RN)

2. **Copy data files** (`examples.ts`, `propDefinitions.ts`) and `hooks/usePickerProps.ts` — unchanged from demo

---

### Phase 3: Foundational UI Components

**Files created:** `GlassView.tsx`, `GridBackground.tsx`, `FloatingModal.tsx`

1. **`GlassView.tsx`** — reusable glass container:
   - Wraps `expo-blur`'s `BlurView`
   - Props: `style`, `children`, `borderRadius`
   - Applies: `glassAlpha` as background opacity, `glassBlur` as blur intensity (from ThemeContext)
   - Adds: border (`glassBorderColor`), shadow, border-radius
   - Used by: `FloatingModal`, `TopBar`

2. **`GridBackground.tsx`** — subtle dot/grid pattern:
   - Absolutely positioned behind the main content
   - Renders a repeating grid of thin lines (24px spacing, 0.3 opacity)
   - Uses theme-aware border color
   - Matches demo's `CentralView.module.css` `.gridBackground`

3. **`FloatingModal.tsx`** — core draggable modal:
   - **Drag:** `PanResponder` with `Animated.ValueXY` for smooth position tracking
   - **Snap zones:** left/right edges at ~80px threshold
   - **Dock state:** when docked, renders as a thin vertical tab on the edge (chevron icon + rotated title); tap to undock
   - **Collapse/expand:** chevron toggle in header
   - **Glass background:** wraps content in `GlassView`
   - **Props:** `id`, `title`, `icon`, `children`, `defaultPosition`, `defaultDocked`
   - **Persistence:** saves `{ position, docked, isCollapsed }` to `AsyncStorage` keyed by `id`
   - **Reset:** listens for a global reset event (via a simple event emitter or context callback)

---

### Phase 4: Header Controls

**Files created:** `TopBar.tsx`, `NavToggle.tsx`, `ModalToggle.tsx`, `GlassControls.tsx`, `ThemeToggle.tsx`

1. **`TopBar.tsx`** — horizontal header bar:
   - Fixed at top (`position: 'absolute'`, `zIndex: 100`)
   - Height: `TOPBAR_HEIGHT` (56px)
   - **Left section:** `NavToggle`
   - **Right section:** `GlassControls`, `ModalToggle`, `ThemeToggle`
   - Semi-transparent background or `GlassView` backing
   - `pointerEvents: 'box-none'` on the container so touches pass through to modals beneath

2. **`NavToggle.tsx`** — hamburger menu button:
   - Simple `TouchableOpacity` with ☰ (hamburger) SVG icon
   - Calls `onToggle()` to show/hide the Examples modal
   - Visual state indicator (highlighted when Examples modal is visible)

3. **`ModalToggle.tsx`** — category visibility toggles:
   - Row of 4 icon buttons (Selection, Dimensions, Colors, Features) + divider + Reset button
   - Active state: filled background + primary text color
   - Inactive state: transparent background + secondary text color
   - Icons ported from demo's inline SVGs → `react-native-svg` components
   - Same icons: pointer (Selection), resize arrows (Dimensions), palette (Colors), sliders (Features), refresh (Reset)

4. **`GlassControls.tsx`** — alpha/blur cycling:
   - Two number-display buttons + divider + reset button
   - Alpha button: cycles +5 per tap, wraps 100→0 (displays as integer percentage)
   - Blur button: cycles +1 per tap, wraps 20→0 (displays as integer)
   - Reset button: restores defaults (alpha=25, blur=5)
   - Updates `ThemeContext.setGlassAlpha` / `setGlassBlur`

5. **`ThemeToggle.tsx`** — theme switch:
   - Single `TouchableOpacity` with sun/moon SVG icon
   - Calls `ThemeContext.toggleTheme()`
   - Icon animates/transitions between states

---

### Phase 5: Content Panels

**Files created:** `ExamplesPanel.tsx`, `ExampleListItem.tsx`, `ComponentPreview.tsx`, `PropControl/*.tsx`

1. **`ExamplesPanel.tsx`** — preset list:
   - `ScrollView` containing `ExampleListItem` cards
   - Receives `activeExampleId` and `onSelectExample` props

2. **`ExampleListItem.tsx`** — single preset card:
   - `TouchableOpacity` with name (bold) + description (secondary text)
   - Active state: accent border-left + highlighted background
   - Matches demo's styling

3. **`ComponentPreview.tsx`** — centered picker display:
   - Fills the main content area (behind modals)
   - Shows formatted date text above the picker
   - `RulerDatePicker` with all current props applied
   - Background uses `backgroundColor` from the current preset/props
   - No device mockup frame — the picker is rendered directly

4. **`PropControl/PropControl.tsx`** — composite control:
   - Renders label + delegated sub-control based on `PropDefinition.type`

5. **`PropControl/BooleanToggle.tsx`** — RN `Switch` component

6. **`PropControl/ColorPicker.tsx`** — uses `reanimated-color-picker`:
   - Renders a compact color swatch; tap to expand into a full wheel/slider panel
   - Supports HEX output
   - Since `react-native-reanimated` and `react-native-gesture-handler` are already installed, integrates seamlessly

7. **`PropControl/NumberInput.tsx`** — `TextInput` with `keyboardType="numeric"`

8. **`PropControl/EnumSelect.tsx`** — horizontal row of `TouchableOpacity` pill buttons

---

### Phase 6: Assembly

**Files created/modified:** `AppShell.tsx`, `App.tsx`

1. **`AppShell.tsx`** — main orchestrator:
   - **State management:**
     - `showExamples: boolean` — toggled by `NavToggle`
     - `visibleModals: Record<Category, boolean>` — toggled by `ModalToggle`
   - **Renders (in order):**
     - `GridBackground` (absolute, behind everything)
     - `ComponentPreview` (centered, z-index 1)
     - `FloatingModal` for Examples (defaultDocked: `'left'`)
     - `FloatingModal` × 4 for property categories (defaultDocked: `'right'`)
     - `TopBar` (fixed at top, z-index 100)
   - **Prop wiring:** uses `usePickerProps()` hook, threads props through

2. **`App.tsx`** — thin entry:
   ```tsx
   <GestureHandlerRootView style={{ flex: 1 }}>
     <ThemeProvider>
       <SafeAreaView style={{ flex: 1 }}>
         <StatusBar />
         <AppShell />
       </SafeAreaView>
     </ThemeProvider>
   </GestureHandlerRootView>
   ```

---

### Phase 7: Polish & Animations

1. **Spring animations** — use `Animated.spring()` for:
   - Modal dock/undock transitions
   - Modal collapse/expand
   - Snap preview indicator

2. **Modal default positions** — calculate based on screen dimensions:
   - Examples: docked left
   - Property modals: docked right (stacked by category order)

3. **AsyncStorage persistence** — save/restore:
   - Modal positions, dock states, collapsed states
   - Theme preference
   - Glass alpha/blur values

4. **Touch polish:**
   - Tap-through: ensure touches on the background area (grid) don't interfere with modals
   - ScrollView inside modals for long prop lists

---

## Dependency Additions

| Package | Purpose | Already Installed? |
|---------|---------|-------------------|
| `expo-blur` | `BlurView` for glass-morphism | ❌ Add |
| `@react-native-async-storage/async-storage` | Persist theme/modal/glass state | ❌ Add |
| `react-native-svg` | SVG icons for toggles/controls | ❌ Add |
| `reanimated-color-picker` | Native color picker (wheel/slider) | ❌ Add |
| `react-native-gesture-handler` | Pan gestures for draggable modals | ✅ Exists |
| `react-native-reanimated` | Smooth animations (also required by color picker) | ✅ Exists |

Install command:
```bash
cd apps/kitchensink && npx expo install expo-blur @react-native-async-storage/async-storage react-native-svg reanimated-color-picker
```

---

## Decisions Log

| Question | Decision |
|----------|----------|
| **Color Picker on Mobile** | Use `reanimated-color-picker` — a full-featured, gesture-based color picker built on reanimated (already a dependency). Renders as a compact swatch + expandable wheel/slider. |
| **Glass Blur on Android** | `expo-blur` with graceful degradation — falls back to semi-transparent overlay on Android. Acceptable. |
| **Modal Default State** | Property modals (Selection, Dimensions, Colors, Features) start **docked right**. Examples modal starts **docked left**. |
| **Grid Background** | Yes — subtle grid/dot pattern behind the picker, matching the demo's `gridBackground` CSS pattern. |

---

## Implementation Order Summary

| Phase | What | Est. Files |
|-------|------|-----------|
| 1 | Scaffolding + tokens | 1 |
| 2 | Context + data + hooks | 4 |
| 3 | GlassView + GridBackground + FloatingModal | 3 |
| 4 | TopBar + NavToggle + ModalToggle + GlassControls + ThemeToggle | 5 |
| 5 | ExamplesPanel + ExampleListItem + ComponentPreview + PropControl/* | 8 |
| 6 | AppShell + App.tsx | 2 |
| 7 | Polish & animations | (edits to existing) |
| **Total** | | **~23 files** |
