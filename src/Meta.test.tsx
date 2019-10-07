import React from 'react';
import { render } from 'testUtils';
import { HelmetProvider } from 'react-helmet-async';
import Meta from './Meta';

test('renders without blowing up', () => {
  render(
    <HelmetProvider>
      <Meta />
    </HelmetProvider>
  );
});
