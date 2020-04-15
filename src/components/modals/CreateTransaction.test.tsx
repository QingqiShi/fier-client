import React from 'react';
import { render } from 'testUtils';
import CreateTransaction from './CreateTransaction';

test('render form', () => {
  const { getByLabelText } = render(<CreateTransaction onClose={() => {}} />);
  expect(getByLabelText(/Amount/)).toBeInTheDocument();
  expect(getByLabelText('Account')).toBeInTheDocument();
  expect(getByLabelText('Date')).toBeInTheDocument();
  expect(getByLabelText('Notes')).toBeInTheDocument();
});
