import bulma from '@theme-ui/preset-bulma';

// https://theme-ui.com/theme-spec
export default {
  ...bulma,
  buttons: {
    primary: {
      // you can reference other values defined in the theme
      color: 'white',
      backgroundColor: 'primary',
    },
    secondary: {
      color: 'text',
      backgroundColor: 'yellow',
    },
  },
  styles: {
    ...bulma,
  },
};
