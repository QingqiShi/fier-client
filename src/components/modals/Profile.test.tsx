import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import Profile from './Profile';

const mockSignOut = jest.fn();
jest.mock('hooks/useFirebaseAuth', () => ({
  __esModule: true,
  default: () => ({
    user: { name: 'Test User', email: 'current@email' },
    signOut: mockSignOut,
  }),
}));

test('show user name', () => {
  const { getByText } = render(<Profile />);
  expect(getByText('Test User')).toBeInTheDocument();
});

test('log out', () => {
  const { getByText } = render(<Profile />);
  fireEvent.click(getByText('Log out'));
  expect(mockSignOut).toHaveBeenCalled();
});
