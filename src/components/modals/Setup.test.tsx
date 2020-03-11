import React from 'react';
import { render } from 'testUtils';
import Setup from './Setup';

test('show user name', () => {
  const { getByText } = render(<Setup />);
  expect(getByText('Categories')).toBeInTheDocument();
});
