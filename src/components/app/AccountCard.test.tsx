import React from 'react';
import { act } from '@testing-library/react';
import { mockAuthUser, mockFirestore, render } from 'testUtils';
import AccountCard from './AccountCard';

const TEST_ACCOUNT = {
  id: 3,
  name: 'Test Account',
  type: 'normal' as const,
  currency: 'gbp' as const,
};
const TEST_USER_ID = 'test-user-id';

test('render account information', () => {
  const { getByText } = render(<AccountCard account={TEST_ACCOUNT} />, {
    userAndSettings: true,
  });

  act(() => void mockAuthUser({ uid: TEST_USER_ID }));
  act(() =>
    mockFirestore(`users/${TEST_USER_ID}/accounts/${TEST_ACCOUNT.id}`, {
      balance: 55.5,
    })
  );

  expect(getByText(TEST_ACCOUNT.name)).toBeInTheDocument();
  expect(getByText('Normal Account')).toBeInTheDocument();
  expect(getByText('£')).toBeInTheDocument();
  expect(getByText('55')).toBeInTheDocument();
  expect(getByText('.')).toBeInTheDocument();
  expect(getByText('50')).toBeInTheDocument();
});

test('balance should be zero when no data exist', () => {
  const { getByText } = render(<AccountCard account={TEST_ACCOUNT} />, {
    userAndSettings: true,
  });

  act(() => void mockAuthUser({ uid: TEST_USER_ID }));
  act(() =>
    mockFirestore(`users/${TEST_USER_ID}/accounts/${TEST_ACCOUNT.id}`, null)
  );

  expect(getByText('£')).toBeInTheDocument();
  expect(getByText('0')).toBeInTheDocument();
  expect(getByText('.')).toBeInTheDocument();
  expect(getByText('00')).toBeInTheDocument();
});
