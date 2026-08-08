import { start } from '@storybook/react-native';

const req = (id: string) => {
  if (id === './RulerDatePicker.stories') {
    return require('../stories/RulerDatePicker.stories');
  }
  return null;
};
req.keys = () => ['./RulerDatePicker.stories'];

const view = start({
  annotations: [
    require('@storybook/react-native/preview'),
    require('@storybook/addon-ondevice-controls/register'),
    require('@storybook/addon-ondevice-actions/register'),
  ],
  storyEntries: [
    {
      titlePrefix: '',
      directory: './stories',
      files: '**/*.stories.tsx',
      importPathMatcher: /^\.\/stories\/.*\.stories\.tsx$/,
      req,
    },
  ],
});

export { view };
