/** @type {import('next').NextConfig} */
const nextConfig = {
  basePath: '/react-native-ruler-date-picker',
  async redirects() {
    return [
      {
        source: '/',
        destination: '/react-native-ruler-date-picker',
        basePath: false,
        permanent: false,
      },
    ];
  },
  eslint: { ignoreDuringBuilds: true },
  transpilePackages: [
    'react-native-reanimated',
    'react-native-gesture-handler',
    'react-native-ruler-date-picker'
  ],
  webpack: (config, { webpack }) => {
    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      'react-native$': 'react-native-web',
      'expo-haptics$': false,
    }
    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...config.resolve.extensions,
    ]
    config.plugins.push(
      new webpack.DefinePlugin({
        __DEV__: process.env.NODE_ENV !== 'production',
      })
    )
    return config
  },
};

export default nextConfig;
