import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { execSync } from 'node:child_process';
import { Snack } from 'snack-sdk';

const require = createRequire(import.meta.url);

// Load .env if present
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const envPath = path.join(rootDir, '.env');

if (fs.existsSync(envPath) && typeof process.loadEnvFile === 'function') {
  try {
    process.loadEnvFile(envPath);
  } catch {
    // Ignore .env parsing errors
  }
}

const kitchensinkDir = path.join(rootDir, 'apps', 'kitchensink');
const packageJsonPath = path.join(kitchensinkDir, 'package.json');

if (!fs.existsSync(kitchensinkDir)) {
  console.error(`Error: Kitchensink directory not found at ${kitchensinkDir}`);
  process.exit(1);
}

// 1. Collect files recursively
function getFiles(dir, base = '') {
  let results = {};
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = base ? `${base}/${file}` : file;
    const stat = fs.statSync(fullPath);

    if (stat && stat.isDirectory()) {
      if (
        file !== 'node_modules' &&
        file !== '.expo' &&
        file !== 'assets' &&
        file !== '.turbo' &&
        file !== 'dist'
      ) {
        Object.assign(results, getFiles(fullPath, relPath));
      }
    } else {
      if (
        file.endsWith('.ts') ||
        file.endsWith('.tsx') ||
        file.endsWith('.json') ||
        file.endsWith('.js')
      ) {
        // Exclude config files and index.ts (Snack expects App.js / App.tsx as root)
        if (
          file !== 'metro.config.js' &&
          file !== 'package.json' &&
          file !== 'tsconfig.json' &&
          file !== 'index.ts'
        ) {
          results[relPath] = {
            type: 'CODE',
            contents: fs.readFileSync(fullPath, 'utf8'),
          };
        }
      }
    }
  }
  return results;
}

// 2. Resolve Expo authentication credentials
function getExpoAuth() {
  // Explicit EXPO_SESSION_SECRET in env/.env takes highest precedence
  if (process.env.EXPO_SESSION_SECRET) {
    return { sessionSecret: process.env.EXPO_SESSION_SECRET };
  }

  // Local Expo CLI login session stored in ~/.expo/state.json
  const homeDir = process.env.HOME || process.env.USERPROFILE;
  if (homeDir) {
    const expoStatePath = path.join(homeDir, '.expo', 'state.json');
    if (fs.existsSync(expoStatePath)) {
      try {
        const state = JSON.parse(fs.readFileSync(expoStatePath, 'utf8'));
        if (state.auth?.sessionSecret) {
          return {
            sessionSecret: state.auth.sessionSecret,
            username: state.auth.username,
          };
        }
      } catch {
        // Ignore parse error and fall through
      }
    }
  }

  // Personal Access Token from EXPO_TOKEN
  const token = process.env.EXPO_TOKEN;
  if (token) {
    if (token.startsWith('{') && token.includes('sessionSecret')) {
      try {
        const parsed = JSON.parse(token);
        return { sessionSecret: parsed.sessionSecret || token };
      } catch {
        return { sessionSecret: token };
      }
    }
    return { accessToken: token };
  }

  return null;
}

// 3. Pre-flight Quality & Lint Checks
async function runCodeQualityChecks(dir) {
  console.log('🔍 Running code quality checks & auto-fixes on kitchensink...');
  let ESLint;
  try {
    const eslintModule = require('eslint');
    ESLint = eslintModule.ESLint;
  } catch (err) {
    console.warn('⚠️  ESLint not available, skipping lint check:', err.message);
    return;
  }

  const eslint = new ESLint({
    fix: true,
    overrideConfigFile: true,
    overrideConfig: [
      {
        files: ['**/*.ts', '**/*.tsx'],
        plugins: {
          'react-hooks': require('eslint-plugin-react-hooks'),
        },
        languageOptions: {
          parser: require('@typescript-eslint/parser'),
          parserOptions: {
            ecmaFeatures: { jsx: true },
          },
        },
        rules: {
          'react-hooks/exhaustive-deps': 'error',
          'react-hooks/rules-of-hooks': 'error',
          'no-empty': 'error',
          'no-debugger': 'error',
        },
      },
    ],
  });

  const patterns = [
    path.join(dir, '**/*.ts'),
    path.join(dir, '**/*.tsx'),
  ];
  const results = await eslint.lintFiles(patterns);

  // Apply autofixes to disk if any
  await ESLint.outputFixes(results);

  let errorCount = 0;
  let warningCount = 0;
  const issues = [];

  for (const r of results) {
    const rel = path.relative(dir, r.filePath);
    for (const m of r.messages) {
      if (m.severity === 2) {
        errorCount++;
        issues.push(`  ❌ [${rel}:${m.line}:${m.column}] ${m.message} (${m.ruleId})`);
      } else if (m.severity === 1) {
        warningCount++;
        issues.push(`  ⚠️  [${rel}:${m.line}:${m.column}] ${m.message} (${m.ruleId})`);
      }
    }
  }

  if (errorCount > 0) {
    console.error(`\n❌ Pre-flight quality check failed with ${errorCount} error(s):`);
    issues.forEach((line) => console.error(line));
    throw new Error('Please resolve all lint errors before syncing to Snack.');
  }

  if (warningCount > 0) {
    console.warn(`\n⚠️  Found ${warningCount} lint warning(s):`);
    issues.forEach((line) => console.warn(line));
  } else {
    console.log('✨ Code quality checks passed cleanly (0 lint errors/warnings).');
  }
}

// 4. Pre-flight TypeScript Typecheck
function validateTypeScript(root) {
  console.log('🛡️  Running TypeScript validation...');
  try {
    execSync('pnpm --filter kitchensink typecheck', {
      cwd: root,
      stdio: 'pipe',
    });
    console.log('✨ TypeScript validation passed (0 type errors).');
  } catch (err) {
    const output = err.stdout?.toString() || err.stderr?.toString() || err.message;
    console.error('\n❌ TypeScript compilation failed:');
    console.error(output);
    throw new Error('Please fix TypeScript errors before syncing to Snack.');
  }
}

// 5. Automated Dependency Alignment for target Expo SDK
async function alignRecommendedDependencies(sdkVersion, dependencies, pkgPath) {
  console.log(`📦 Verifying dependency compatibility for Expo SDK ${sdkVersion}...`);
  let wantedVersions = {};

  try {
    const probeSnack = new Snack({ sdkVersion, dependencies: {} });
    const probeState = await probeSnack.getStateAsync();
    if (probeState.wantedDependencyVersions) {
      wantedVersions = probeState.wantedDependencyVersions;
    }
  } catch {
    // If probe fails, continue with fallback
  }

  let packageJsonUpdated = false;
  let pkg = null;
  if (fs.existsSync(pkgPath)) {
    try {
      pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf8'));
    } catch {
      // Ignore
    }
  }

  for (const [dep, config] of Object.entries(dependencies)) {
    const recommended = wantedVersions[dep];
    if (recommended && config.version !== recommended) {
      console.log(
        `🔄 Auto-aligning dependency '${dep}': ${config.version} -> ${recommended} (SDK ${sdkVersion} recommended)`
      );
      dependencies[dep].version = recommended;

      if (pkg && pkg.dependencies && pkg.dependencies[dep]) {
        pkg.dependencies[dep] = recommended;
        packageJsonUpdated = true;
      }
    }
  }

  if (packageJsonUpdated && pkg) {
    fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf8');
    console.log('📝 Updated apps/kitchensink/package.json to persist recommended dependency versions.');
  }

  console.log('✅ Dependencies verified and aligned with Expo SDK recommendations.');
}

// 6. Main sync execution
async function syncSnack() {
  const sdkVersion = '52.0.0';

  // Step 1: Run code quality checks & autofixes
  await runCodeQualityChecks(kitchensinkDir);

  // Step 2: Run TypeScript typecheck validation
  validateTypeScript(rootDir);

  // Step 3: Read dependencies from apps/kitchensink/package.json
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = {};

  // Resolve library version if kitchensink uses workspace:*
  const libraryPkgPath = path.join(rootDir, 'packages', 'react-native-ruler-date-picker', 'package.json');
  let libraryVersion = '^0.2.1';
  if (fs.existsSync(libraryPkgPath)) {
    try {
      const libPkg = JSON.parse(fs.readFileSync(libraryPkgPath, 'utf8'));
      if (libPkg.version) {
        libraryVersion = `^${libPkg.version}`;
      }
    } catch {
      // fallback
    }
  }

  if (pkg.dependencies) {
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      // Exclude metro-runtime and web-only helpers not needed in Snack
      if (dep !== '@expo/metro-runtime' && dep !== 'react-native-web') {
        const resolvedVersion =
          dep === 'react-native-ruler-date-picker' && (version.startsWith('workspace:') || version === '*')
            ? libraryVersion
            : version;
        dependencies[dep] = { version: resolvedVersion };
      }
    }
  }

  // Step 4: Verify and align dependencies with Expo SDK recommendations
  await alignRecommendedDependencies(sdkVersion, dependencies, packageJsonPath);

  // Step 5: Read verified, clean kitchensink files
  console.log('📦 Reading kitchensink files...');
  const files = getFiles(kitchensinkDir);

  // Ensure App.js entrypoint exists for Snack runtime loader
  if (files['App.tsx']) {
    files['App.js'] = {
      type: 'CODE',
      contents: "export { default } from './App';\n",
    };
  }

  console.log(`📁 Uploading ${Object.keys(files).length} files to Expo Snack...`);

  const auth = getExpoAuth();

  const snackOptions = {
    name: 'Ruler Date Picker - Kitchensink',
    description: 'Official interactive kitchensink sandbox for react-native-ruler-date-picker',
    sdkVersion: '52.0.0',
    files,
    dependencies,
  };

  if (auth) {
    if (auth.sessionSecret) {
      console.log(`🔑 Authenticating with Expo account session${auth.username ? ` (@${auth.username})` : ''}...`);
      snackOptions.user = { sessionSecret: auth.sessionSecret };
    } else if (auth.accessToken) {
      console.log('🔑 Authenticating with EXPO_TOKEN...');
      snackOptions.user = { accessToken: auth.accessToken };
    }
  } else {
    console.log('ℹ️  No Expo account session or token found (will save as public snapshot).');
  }

  const snack = new Snack(snackOptions);
  const result = await snack.saveAsync();

  const isAccountSnack = result.id?.startsWith('@');
  const snackUrl = isAccountSnack
    ? `https://snack.expo.dev/${result.id}`
    : `https://snack.expo.dev/${result.id}`;

  console.log('\n========================================');
  console.log('✅ Expo Snack synced successfully!');
  console.log(`🔗 URL: ${snackUrl}`);
  console.log(`🆔 ID:  ${result.id}`);
  if (result.accountSnackId) {
    console.log(`📦 Account Snack ID: ${result.accountSnackId}`);
  }
  console.log('========================================\n');

  if (!auth?.sessionSecret) {
    console.log('💡 Tip: To sync directly into @md-rehman/ruler-date-picker---kitchensink:');
    console.log('   Run `npx expo login` on this machine, or set EXPO_SESSION_SECRET in .env.\n');
  }
}

syncSnack().catch((err) => {
  console.error('❌ Failed to sync snack:', err);
  process.exit(1);
});

