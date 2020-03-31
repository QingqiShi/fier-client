import React from 'react';
import { render } from 'testUtils';
import settings from 'stores/settings';
import Currency from './Currency';

test('show correct currency', () => {
  const { getByText } = render(
    <Currency currency="GBP" value={123.45} variant={['body1', 'body2']} />,
    { stores: [settings] }
  );
  expect(getByText('£')).toBeInTheDocument();
  expect(getByText('123')).toBeInTheDocument();
  expect(getByText('.')).toBeInTheDocument();
  expect(getByText('45')).toBeInTheDocument();
});
