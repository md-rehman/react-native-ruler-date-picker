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

5. **Run Kitchensink Mobile Playground**:
   ```bash
   cd apps/kitchensink
   pnpm start
   ```

6. **Run Documentation & Web Playground**:
   ```bash
   cd apps/docs
   pnpm dev
   ```

## Pull Request Guidelines

- Ensure `pnpm build` and `pnpm typecheck` pass cleanly before submitting your PR.
- Test new component props and customization options in `apps/kitchensink`.
- Keep component code focused, memoized, and performant.
