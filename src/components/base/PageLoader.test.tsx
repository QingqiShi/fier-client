import React from 'react';
import { render } from 'testUtils';
import PageLoader from './PageLoader';

test('renders without blowing up', () => {
  render(<PageLoader />);
});
