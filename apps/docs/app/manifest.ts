import { MetadataRoute } from 'next';

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'react-native-ruler-date-picker',
    short_name: 'RulerDatePicker',
    description:
      'A performant, customizable horizontal ruler date picker & scroll wheel for React Native and Expo.',
    start_url: '/react-native-ruler-date-picker',
    display: 'standalone',
    background_color: '#0B0F19',
    theme_color: '#38BDF8',
    icons: [
      {
        src: '/react-native-ruler-date-picker/icon.svg',
        sizes: 'any',
        type: 'image/svg+xml',
      },
      {
        src: '/react-native-ruler-date-picker/favicon.ico',
        sizes: 'any',
        type: 'image/x-icon',
      },
    ],
  };
}

