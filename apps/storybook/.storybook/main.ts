import type { StorybookConfig } from '@storybook/react-vite';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { transformSync } from 'esbuild';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

const config: StorybookConfig = {
  stories: ['../stories/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links'],
  framework: {
    name: '@storybook/react-vite',
    options: {},
  },
  viteFinal: async (config) => {
    config.resolve = config.resolve || {};
    config.resolve.alias = [
      { find: /^expo-modules-core\/(.*)/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^expo-modules-core$/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^expo-haptics$/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^react-native\/Libraries\/(.*)/, replacement: path.resolve(__dirname, 'empty-module.js') },
      { find: /^react-native$/, replacement: path.resolve(__dirname, 'react-native-web-shim.js') },
    ];
    config.optimizeDeps = config.optimizeDeps || {};
    config.optimizeDeps.exclude = [
      ...(config.optimizeDeps.exclude || []),
      'react-native-reanimated',
    ];
    config.plugins = config.plugins || [];
    config.plugins.push({
      name: 'transform-jsx-in-node-modules',
      transform(code, id) {
        if (id.includes('react-native-reanimated') && id.endsWith('.js')) {
          const result = transformSync(code, { loader: 'jsx', jsx: 'automatic' });
          return { code: result.code, map: result.map };
        }
      },
    });
    return config;
  },
};

export default config;
