import { Link, Router } from '@reach/router';
import React, { Suspense } from 'react';
import { CacheProvider, createCache } from 'react/unstable-cache';
import { ThemeProvider } from 'theme-ui';
import theme from '../theme';
import ErrorBoundary from './ErrorBoundary';
import NotFound from './NotFound';
import Page from './Page';

const cache = createCache();

const Suspended = () => {
  console.log('suspended');
  return 'Loading...';
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CacheProvider value={cache}>
        <ErrorBoundary fallback="Error">
          <Suspense fallback={<Suspended />}>
            <Link to="/">Home</Link>
            <Link to="/skldfj">404</Link>
            <Router>
              <Page path="/" />
              <NotFound default />
            </Router>
          </Suspense>
        </ErrorBoundary>
      </CacheProvider>
    </ThemeProvider>
  );
};

export default App;
