import React from 'react';
import { render } from 'testUtils';
import HorizontalListItem from './HorizontalListItem';

test('renders with margin', () => {
  const { getByText } = render(<HorizontalListItem>test 1</HorizontalListItem>);
  expect(getByText('test 1')).toHaveStyle('margin-right: 8px');
});
