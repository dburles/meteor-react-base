import { Router } from '@reach/router';
import React from 'react';
import { ThemeProvider } from 'theme-ui';
import theme from '../theme';
import NotFound from './NotFound';
import Page from './Page';

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <Router>
        <Page path="/" />
        <NotFound default />
      </Router>
    </ThemeProvider>
  );
};

export default App;
