import React from 'react';
import type { Preview } from '@storybook/react';
import { GestureHandlerRootView } from 'react-native-gesture-handler';

const preview: Preview = {
  decorators: [
    (Story) =>
      React.createElement(
        GestureHandlerRootView,
        { style: { flex: 1 } },
        React.createElement(Story)
      ),
  ],
  parameters: {
    controls: {
      expanded: true,
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
  },
};

export default preview;
