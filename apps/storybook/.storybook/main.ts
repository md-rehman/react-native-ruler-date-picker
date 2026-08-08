import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links'],
  deviceAddons: [
    '@storybook/addon-ondevice-controls',
    '@storybook/addon-ondevice-actions',
  ],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.define = {
      ...config.define,
      __DEV__: JSON.stringify(true),
      'process.env.NODE_ENV': JSON.stringify('development'),
      'process.env': JSON.stringify({ NODE_ENV: 'development' }),
      process: JSON.stringify({ env: { NODE_ENV: 'development' } }),
    };
    config.resolve = config.resolve || {};
    config.resolve.extensions = [
      '.web.tsx',
      '.web.ts',
      '.web.jsx',
      '.web.js',
      '.tsx',
      '.ts',
      '.jsx',
      '.js',
    ];
    config.resolve.alias = [
      { find: /^invariant$/, replacement: path.resolve(__dirname, 'invariant-shim.js') },
      { find: /^hoist-non-react-statics$/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /react-native-reanimated\/scripts\/validate-worklets-version/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^react-native-is-edge-to-edge$/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^expo-modules-core\/(.*)/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^expo-modules-core$/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^expo-haptics$/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^react-native\/Libraries\/(.*)/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^react-native$/, replacement: path.resolve(__dirname, 'react-native-web-shim.js') },
    ];
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.include = [
      ...(config.optimizeDeps.include || []),
      'react',
      'react-dom',
      'react/jsx-runtime',
      'react/jsx-dev-runtime',
    ];
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      'react-native-reanimated',
      'react-native-gesture-handler',
    ];
    config.plugins = config.plugins || [];
    config.plugins.push({
      name: 'transform-jsx-in-node-modules',
      transform(code, id) {
        const cleanId = id.split('?')[0];
        if (cleanId.includes('react-native-reanimated') && (cleanId.endsWith('.js') || cleanId.endsWith('.ts') || cleanId.endsWith('.jsx') || cleanId.endsWith('.tsx'))) {
          const result = transformSync(code, { loader: 'jsx', jsx: 'automatic' });
          return { code: result.code, map: result.map };
        }
      },
    });
    return config;
  },
};

export default config;
