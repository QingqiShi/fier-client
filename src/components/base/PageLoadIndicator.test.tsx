import React from 'react';
import { render } from 'testUtils';
import PageLoadIndicator from './PageLoadIndicator';

test('renders without blowing up', () => {
  render(<PageLoadIndicator />);
});
