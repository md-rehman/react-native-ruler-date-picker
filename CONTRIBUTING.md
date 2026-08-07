# Contributing to `react-native-ruler-date-picker`

Thank you for considering contributing to `react-native-ruler-date-picker`!

## Development Setup

1. **Clone the repository**:
   ```bash
   git clone git@github.com:md-rehman/react-native-ruler-date-picker.git
   cd react-native-ruler-date-picker
   ```

2. **Install pnpm**:
   ```bash
   npm install -g pnpm
   ```

3. **Install workspace dependencies**:
   ```bash
   pnpm install
   ```

4. **Build the core library**:
   ```bash
   pnpm build
   ```

5. **Run the example app**:
   ```bash
   cd apps/example
   pnpm start
   ```

6. **Run Storybook**:
   ```bash
   cd apps/storybook
   pnpm start
   ```

7. **Run Kitchensink Showcase**:
   ```bash
   cd apps/kitchensink
   pnpm start
   ```

## Pull Request Guidelines

- Ensure `pnpm build` and `pnpm typecheck` pass cleanly before submitting your PR.
- Add relevant Storybook stories in `apps/storybook` for any new component props or features.
- Keep component code focused, memoized, and performant.
