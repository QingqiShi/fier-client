import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import ProfileSettings from './ProfileSettings';

const mockUseAuth = {
  user: { name: 'current name', email: 'current@email' },
  updateName: jest.fn(),
  updateEmail: jest.fn(),
  updatePassword: jest.fn()
};
jest.mock('hooks/useFirebaseAuth', () => ({
  __esModule: true,
  default: () => mockUseAuth
}));

jest.useFakeTimers();

test('renders', () => {
  const { getByText, getAllByText } = render(<ProfileSettings />);

  // Title
  expect(getByText('Profile')).toBeInTheDocument();

  // Settings
  expect(getAllByText('Display Name')[0]).toBeInTheDocument();
  expect(getAllByText('Email')[0]).toBeInTheDocument();
  expect(getAllByText('Password')[0]).toBeInTheDocument();
});

test('change name', () => {
  const { getByText, getAllByText, getByLabelText } = render(
    <ProfileSettings />
  );

  fireEvent.click(getAllByText('Display Name')[0]);
  const nameField = getByLabelText('Display Name', { exact: false });

  expect((nameField as HTMLInputElement).value).toBe(mockUseAuth.user.name);

  fireEvent.change(nameField, {
    target: { value: 'New Name' }
  });
  fireEvent.click(getByText('Change Name'));
  jest.runAllTimers();

  expect(mockUseAuth.updateName).toHaveBeenCalledWith('New Name');
  expect(nameField).not.toBeVisible();
});

test('change email', () => {
  const { getByText, getAllByText, getByLabelText, getAllByLabelText } = render(
    <ProfileSettings />
  );

  fireEvent.click(getAllByText('Email')[0]);
  const emailField = getByLabelText('Email', { exact: false });

  expect((emailField as HTMLInputElement).value).toBe(mockUseAuth.user.email);

  fireEvent.change(emailField, {
    target: { value: 'new@email' }
  });
  fireEvent.change(getAllByLabelText('Current Password', { exact: false })[0], {
    target: { value: '12345' }
  });
  fireEvent.click(getByText('Change Email'));
  jest.runAllTimers();

  expect(mockUseAuth.updateEmail).toHaveBeenCalledWith('new@email', '12345');
  expect(emailField).not.toBeVisible();
});

test('change password', () => {
  const { getByText, getAllByText, getByLabelText, getAllByLabelText } = render(
    <ProfileSettings />
  );

  fireEvent.click(getAllByText('Password')[0]);
  fireEvent.change(getByLabelText('New Password', { exact: false }), {
    target: { value: 'testing' }
  });
  fireEvent.change(getAllByLabelText('Current Password', { exact: false })[1], {
    target: { value: '12345' }
  });
  fireEvent.click(getByText('Change Password'));
  jest.runAllTimers();

  expect(mockUseAuth.updatePassword).toHaveBeenCalledWith('testing', '12345');
  expect(getByLabelText('New Password', { exact: false })).not.toBeVisible();
});
