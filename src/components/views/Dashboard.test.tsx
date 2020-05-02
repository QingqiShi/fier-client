import React from 'react';
import { act } from '@testing-library/react';
import { mockAuthUser, mockFirestore, render } from 'testUtils';
import Dashboard from './Dashboard';

test('render accounts', () => {
  const { getByText } = render(<Dashboard />, { userAndSettings: true });

  act(() => void mockAuthUser({ uid: 'testid' }));
  act(() =>
    mockFirestore('users/testid/settings/app', {
      locale: 'en',
      accounts: [
        {
          id: 1,
          name: 'Test Account',
          type: 'debt',
          currency: 'usd',
        },
        {
          id: 2,
          name: 'Another Account',
          type: 'normal',
          currency: 'cny',
        },
      ],
    })
  );

  expect(getByText('Accounts')).toBeInTheDocument();

  expect(getByText('Debt Account')).toBeInTheDocument();
  expect(getByText('Test Account')).toBeInTheDocument();
  expect(getByText(/\$/)).toBeInTheDocument();

  expect(getByText('Normal Account')).toBeInTheDocument();
  expect(getByText('Another Account')).toBeInTheDocument();
  expect(getByText(/¥/)).toBeInTheDocument();
});

test('render transactions', () => {
  const { getByText } = render(<Dashboard />, { userAndSettings: true });

  act(() => void mockAuthUser({ uid: 'testid' }));
  act(() =>
    mockFirestore('users/testid/settings/app', {
      locale: 'en',
      accounts: [
        { id: 1, name: 'Test Account', currency: 'gbp', type: 'normal' },
      ],
      categories: [{ id: 1, emoji: '💰', name: 'Money' }],
    })
  );

  const timestamps = [
    { timestamp: 1588424400, date: 'May 2, 2020' },
    { timestamp: 1588312800, date: 'May 1, 2020' },
  ];
  act(() =>
    mockFirestore('users/testid/transactions', [
      {
        fromAccountId: 1,
        dateTime: timestamps[0].timestamp,
        categoryId: 1,
        value: -50,
        toAccountId: null,
      },
      {
        fromAccountId: 1,
        dateTime: timestamps[1].timestamp,
        categoryId: 1,
        value: 20,
        toAccountId: null,
      },
    ])
  );

  expect(getByText('Transactions')).toBeInTheDocument();
  expect(getByText(timestamps[0].date)).toBeInTheDocument();
  expect(getByText(timestamps[1].date)).toBeInTheDocument();
});
