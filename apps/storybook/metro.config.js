const { getDefaultConfig } = require('expo/metro-config');
const path = require('path');

const projectRoot = __dirname;
const monorepoRoot = path.resolve(projectRoot, '../..');

const config = getDefaultConfig(projectRoot);

config.watchFolders = [monorepoRoot];
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(monorepoRoot, 'node_modules'),
];

const originalResolveRequest = config.resolver.resolveRequest;
config.resolver.resolveRequest = (context, moduleName, platform) => {
  if (moduleName === '@storybook/addon-ondevice-controls/preview') {
    return (originalResolveRequest || context.resolveRequest)(
      context,
      '@storybook/addon-ondevice-controls/register',
      platform
    );
  }
  if (moduleName === '@storybook/addon-ondevice-actions/preview') {
    return (originalResolveRequest || context.resolveRequest)(
      context,
      '@storybook/addon-ondevice-actions/register',
      platform
    );
  }
  return (originalResolveRequest || context.resolveRequest)(
    context,
    moduleName,
    platform
  );
};

module.exports = config;
