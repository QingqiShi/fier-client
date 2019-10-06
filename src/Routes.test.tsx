import React from 'react';
import { act, waitForElementToBeRemoved } from '@testing-library/react';
import { render } from 'testUtils';
import { auth as mockAuth, mockAuthState } from 'firebase/app';
import FirebaseSetup from 'components/app/FirebaseSetup';
import user from 'stores/user';
import Routes from './Routes';

import('components/app/BottomNav');
import('components/views/Dashboard');
import('components/views/Activity');
import('components/views/Charts');
import('components/views/Wallets');
import('components/views/Login');
import('components/views/Register');

beforeEach(() => {
  mockAuth().onAuthStateChanged(() => {});
  jest.clearAllMocks();
});

test('renders guest user', async () => {
  const { asFragment, getByRole } = render(<Routes />, [user]);
  act(() => mockAuthState(null));
  await waitForElementToBeRemoved(() => getByRole('progressbar'));
  expect(asFragment()).toMatchSnapshot();
});

test('renders logged in user', async () => {
  const { asFragment, getByRole } = render(
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
  await waitForElementToBeRemoved(() => getByRole('progressbar'));
  expect(asFragment()).toMatchSnapshot();
});
