import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { Snack } from 'snack-sdk';

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

// 2. Main sync execution
async function syncSnack() {
  console.log('📦 Reading kitchensink files...');
  const files = getFiles(kitchensinkDir);

  // Ensure App.js entrypoint exists for Snack runtime loader
  if (files['App.tsx']) {
    files['App.js'] = {
      type: 'CODE',
      contents: "export { default } from './App';\n",
    };
  }

  // Read dependencies from apps/kitchensink/package.json
  const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
  const dependencies = {};

  if (pkg.dependencies) {
    for (const [dep, version] of Object.entries(pkg.dependencies)) {
      // Exclude metro-runtime and web-only helpers not needed in Snack
      if (dep !== '@expo/metro-runtime' && dep !== 'react-native-web') {
        dependencies[dep] = { version };
      }
    }
  }

  console.log(`📁 Uploading ${Object.keys(files).length} files to Expo Snack...`);

  const token = process.env.EXPO_TOKEN || process.env.EXPO_SESSION_SECRET;

  const snackOptions = {
    name: 'Ruler Date Picker - Kitchensink',
    description: 'Official interactive kitchensink sandbox for react-native-ruler-date-picker',
    sdkVersion: '52.0.0',
    files,
    dependencies,
  };

  if (token) {
    console.log('🔑 Authenticating with EXPO_TOKEN...');
    snackOptions.user = { sessionSecret: token };
  } else {
    console.log('ℹ️  No EXPO_TOKEN found in environment (will save as public snapshot).');
  }

  const snack = new Snack(snackOptions);
  const result = await snack.saveAsync();

  console.log('\n========================================');
  console.log('✅ Expo Snack synced successfully!');
  console.log(`🔗 URL: ${result.url || `https://snack.expo.dev/${result.id}`}`);
  console.log(`🆔 ID:  ${result.id}`);
  console.log('========================================\n');

  if (!token) {
    console.log('💡 Tip: If you want to sync directly into @md-rehman/ruler-date-picker---kitchensink:');
    console.log('   1. Open the URL above');
    console.log('   2. Click "Save" while logged into your Expo account (@md-rehman)');
    console.log('   Or set EXPO_TOKEN=your_token in a .env file.\n');
  }
}

syncSnack().catch((err) => {
  console.error('❌ Failed to sync snack:', err);
  process.exit(1);
});

