import React from 'react';
import { act, waitFor } from '@testing-library/react';
import { clearAuthListeners, mockAuthUser, render } from 'testUtils';
import { mockDocSnapshot } from 'firebase/app';
import FirebaseSetup from 'components/app/FirebaseSetup';
import user from 'stores/user';
import settings from 'stores/settings';
import Routes from './Routes';

import('components/app/BottomNav');
import('components/views/Dashboard');
import('components/views/Activity');
import('components/views/Charts');
import('components/views/Wallets');
import('components/views/Login');
import('components/views/Register');

beforeEach(() => {
  clearAuthListeners();
  jest.clearAllMocks();
});

test('renders guest user', async () => {
  const { findAllByText } = render(<Routes />, { stores: [user] });
  expect((await findAllByText('Log in')).length).toBeGreaterThan(0);
});

test('redirects to user locale', async () => {
  const { findAllByText } = render(
    <FirebaseSetup>
      <Routes />
    </FirebaseSetup>,
    { stores: [settings, user] }
  );

  act(() => {
    mockAuthUser({ uid: 'testid' });
  });
  act(() => {
    mockDocSnapshot('settings/testid', { locale: 'zh', categories: [1] });
  });

  expect((await findAllByText('概览')).length).toBeGreaterThan(0);
});

test('renders logged in user', async () => {
  const { getByTestId } = render(
    <FirebaseSetup>
      <Routes />
    </FirebaseSetup>,
    { stores: [settings, user] }
  );

  act(() => {
    mockAuthUser({ uid: 'testid' });
  });
  act(() => {
    mockDocSnapshot('settings/testid', { locale: 'en', categories: [1] });
  });

  await waitFor(() => {
    getByTestId('topnav-profile');
  });
});

test('show setup modal if categories has length 0', async () => {
  const { findByText } = render(
    <FirebaseSetup>
      <Routes />
    </FirebaseSetup>,
    { stores: [settings, user] }
  );

  act(() => {
    mockAuthUser({ uid: 'testid' });
  });
  act(() => {
    mockDocSnapshot('settings/testid', { locale: 'en', categories: [] });
  });

  expect(await findByText('Categories')).toBeInTheDocument();
});
