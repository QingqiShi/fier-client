import React from 'react';
import { act } from '@testing-library/react';
import dayjs from 'dayjs';
import { mockAuthUser, mockFirestore, render } from 'testUtils';
import TransactionList from './TransactionList';

const timestamps = [
  { timestamp: 1588424400, date: 'May 2, 2020' },
  { timestamp: 1588395600, date: 'May 2, 2020' },
  { timestamp: 1588312800, date: 'May 1, 2020' },
];

test('render empty list', () => {
  const transactions: Data.Transaction[] = [];
  const { getByText } = render(<TransactionList transactions={transactions} />);
  expect(getByText('No records')).toBeInTheDocument();
});

test('render transaction', () => {
  const { getByText } = render(
    <TransactionList
      transactions={[
        {
          id: '1',
          fromAccountId: 1,
          dateTime: dayjs.unix(timestamps[0].timestamp),
          categoryId: 1,
          value: -50,
          toAccountId: null,
        },
      ]}
    />,
    { userAndSettings: true }
  );

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`users/${userId}/settings/app`, {
      locale: 'en',
      accounts: [{ id: 1, name: 'Test Account', currency: 'gbp' }],
      categories: [{ id: 1, emoji: '💰', name: 'Money' }],
    })
  );

  expect(getByText('💰')).toBeInTheDocument();
  expect(getByText('-')).toBeInTheDocument();
  expect(getByText('£')).toBeInTheDocument();
  expect(getByText('50')).toBeInTheDocument();
  expect(getByText('.')).toBeInTheDocument();
  expect(getByText('00')).toBeInTheDocument();
  expect(getByText('Test Account')).toBeInTheDocument();
});

test('render transactions grouped by day', () => {
  const { getByText } = render(
    <TransactionList
      transactions={[
        {
          id: '1',
          fromAccountId: 1,
          dateTime: dayjs.unix(timestamps[0].timestamp),
          categoryId: 1,
          value: -50,
          toAccountId: null,
        },
        {
          id: '2',
          fromAccountId: 1,
          dateTime: dayjs.unix(timestamps[1].timestamp),
          categoryId: 2,
          value: 20,
          toAccountId: null,
        },
        {
          id: '3',
          fromAccountId: 2,
          dateTime: dayjs.unix(timestamps[2].timestamp),
          categoryId: 1,
          value: -50,
          toAccountId: null,
        },
      ]}
    />,
    { userAndSettings: true }
  );

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`users/${userId}/settings/app`, {
      locale: 'en',
      accounts: [
        { id: 1, name: 'Test Account', currency: 'gbp' },
        { id: 2, name: 'Another Account', currency: 'gbp' },
      ],
      categories: [
        { id: 1, emoji: '💰', name: 'Money' },
        { id: 2, emoji: '💩', name: 'Poo' },
      ],
    })
  );

  expect(getByText(timestamps[0].date)).toBeInTheDocument();
  expect(getByText(timestamps[2].date)).toBeInTheDocument();
});
