import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import NavMenu from './NavMenu';

const mockSignOut = jest.fn();
jest.mock('hooks/useAuth', () => ({
  __esModule: true,
  default: () => ({
    user: { name: 'Test User', email: 'current@email' },
    signOut: mockSignOut
  })
}));

describe('NavMenu', () => {
  it('renders title', () => {
    const { getByText } = render(<NavMenu open onClose={() => {}} />);
    expect(getByText('fier')).toBeInTheDocument();
  });

  it('show user name', () => {
    const { getByText } = render(<NavMenu open onClose={() => {}} />);
    expect(getByText('Test User')).toBeInTheDocument();
  });

  it('log out', () => {
    const { getByText } = render(<NavMenu open onClose={() => {}} />);
    fireEvent.click(getByText('Log out'));
    expect(mockSignOut).toHaveBeenCalled();
  });
});
