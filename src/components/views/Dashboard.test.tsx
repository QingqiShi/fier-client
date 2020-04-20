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

  expect(getByText('Debt Account')).toBeInTheDocument();
  expect(getByText('Test Account')).toBeInTheDocument();
  expect(getByText(/\$/)).toBeInTheDocument();

  expect(getByText('Normal Account')).toBeInTheDocument();
  expect(getByText('Another Account')).toBeInTheDocument();
  expect(getByText(/¥/)).toBeInTheDocument();
});
