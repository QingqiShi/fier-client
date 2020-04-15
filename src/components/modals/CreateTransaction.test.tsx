import React from 'react';
import { act, fireEvent } from '@testing-library/react';
import { mockAuthUser, mockFirestore, render } from 'testUtils';
import CreateTransaction from './CreateTransaction';

test('render form', () => {
  const { getByLabelText, getByText } = render(
    <CreateTransaction onClose={() => {}} />,
    {
      userAndSettings: true,
    }
  );

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`settings/${userId}`, {
      locale: 'en',
      accounts: [
        { id: 1, name: 'Test Account' },
        { id: 2, name: 'Another Account' },
      ],
    })
  );

  expect(getByLabelText(/Amount/)).toBeInTheDocument();
  expect(getByLabelText('Account')).toBeInTheDocument();
  expect(getByLabelText('Date')).toBeInTheDocument();
  expect(getByLabelText('Notes')).toBeInTheDocument();

  // Amount
  fireEvent.change(getByLabelText(/Amount/), { target: { value: '12.5' } });

  // Account
  fireEvent.mouseDown(getByLabelText('Account'));
  fireEvent.click(getByText('Another Account'));

  // Date
  fireEvent.click(getByLabelText('Date'));
  fireEvent.mouseDown(getByText('28'));
  fireEvent.mouseMove(getByText('28'));
  fireEvent.mouseUp(getByText('28'));
  fireEvent.touchStart(getByText('28'));
  fireEvent.touchMove(getByText('28'));
  fireEvent.touchEnd(getByText('28'));
  fireEvent.click(getByText('28'));
  fireEvent.click(getByText('OK'));

  // Notes
  fireEvent.change(getByLabelText('Notes'), {
    target: { value: 'Some notes' },
  });
});

test('show error for invalid amount', () => {
  const { getByLabelText, getByText } = render(
    <CreateTransaction onClose={() => {}} />
  );

  expect(getByText('You must enter an amount')).toBeInTheDocument();

  fireEvent.change(getByLabelText(/Amount/), { target: { value: 'invalid' } });
  expect(getByText("This doesn't look like a number")).toBeInTheDocument();
});
