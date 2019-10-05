import React from 'react';
import { act, waitForDomChange } from '@testing-library/react';
import { render } from 'testUtils';
import { auth as mockAuth, mockAuthState } from 'firebase/app';
import FirebaseSetup from 'components/app/FirebaseSetup';
import user from 'stores/user';
import Routes from './Routes';

jest.mock('react-helmet-async', () => ({
  __esModule: true,
  Helmet: () => null
}));

beforeEach(() => {
  mockAuth().onAuthStateChanged(() => {});
  jest.clearAllMocks();
});

test('renders guest user', async () => {
  const { asFragment } = render(<Routes />, [user]);
  act(() => mockAuthState(null));
  await waitForDomChange();
  expect(asFragment()).toMatchSnapshot();
});

test('renders logged in user', async () => {
  const { asFragment } = render(
    <FirebaseSetup>
      <Routes />
    </FirebaseSetup>,
    [user]
  );
  const mockUser = {
    email: 'test@test.com',
    updateProfile: jest.fn(() => Promise.resolve()),
    updateEmail: jest.fn(() => Promise.resolve()),
    updatePassword: jest.fn(() => Promise.resolve()),
    reauthenticateWithCredential: jest.fn(() => Promise.resolve())
  };
  act(() => mockAuthState(mockUser));
  await waitForDomChange();
  expect(asFragment()).toMatchSnapshot();
});
