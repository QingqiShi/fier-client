import React from 'react';
import { act, fireEvent, waitFor } from '@testing-library/react';
import createMockRaf, { MockRaf } from '@react-spring/mock-raf';
import { FrameLoop, Globals } from '@react-spring/web';
import {
  clearAuthListeners,
  mockAuthUser,
  mockFirestore,
  render
} from 'testUtils';
import SnackbarMessage from 'components/app/SnackbarMessage';
import snackbar from 'stores/snackbar';
import Routes from './Routes';

// Load files upfront to suppress lazy load
import('components/app/BottomNav');
import('components/views/Dashboard');
import('components/views/Activity');
import('components/views/Charts');
import('components/views/Wallets');
import('components/views/Login');
import('components/views/Register');

let mockRaf: MockRaf;
beforeEach(() => {
  mockRaf = createMockRaf();
  Globals.assign({
    now: mockRaf.now,
    requestAnimationFrame: mockRaf.raf,
    cancelAnimationFrame: mockRaf.cancel,
    frameLoop: new FrameLoop()
  });
});

beforeEach(() => {
  clearAuthListeners();
  jest.clearAllMocks();
});

test('renders guest user', async () => {
  const { findAllByText } = render(<Routes />, { userAndSettings: true });
  act(() => void mockAuthUser(null));
  expect((await findAllByText('Log in')).length).toBeGreaterThan(0);
});

test('redirects to user locale', async () => {
  const { findAllByText } = render(<Routes />, { userAndSettings: true });

  act(() => void mockAuthUser({ uid: 'testid' }));
  act(() =>
    mockFirestore('settings/testid', { locale: 'zh', categories: [1] })
  );

  expect((await findAllByText('概览')).length).toBeGreaterThan(0);
});

test('renders logged in user', async () => {
  const { getByTestId } = render(<Routes />, { userAndSettings: true });

  act(() => void mockAuthUser({ uid: 'testid' }));
  act(() =>
    mockFirestore('settings/testid', { locale: 'en', categories: [1] })
  );

  await waitFor(() => {
    getByTestId('topnav-profile');
  });
});

test('show setup modal if categories has length 0', async () => {
  const { findByText } = render(<Routes />, { userAndSettings: true });

  act(() => void mockAuthUser({ uid: 'testid' }));
  act(() => mockFirestore('settings/testid', { locale: 'en', categories: [] }));
  act(() => mockRaf.flush());

  expect(await findByText('Categories')).toBeInTheDocument();
});

test('show snackbar message when updates available', async () => {
  const { findByText, getByText } = render(
    <div>
      <Routes />
      <SnackbarMessage />
    </div>,
    { userAndSettings: true, stores: [snackbar] }
  );

  act(() => void mockAuthUser({ uid: 'testid' }));
  act(() => mockFirestore('settings/testid', { locale: 'en', categories: [] }));
  act(() => mockRaf.flush());

  // Mock service worker updated callback
  act(() => window.swStates.callback && window.swStates.callback());
  expect(await findByText(/New update available/)).toBeInTheDocument();

  fireEvent.click(getByText('Update Now'));
  expect(window.swStates.updateAndReload).toHaveBeenCalled();
});

test('show snackbar message when update event was missed', async () => {
  // Mock service worker update have happened already
  window.swStates.updated = true;

  const { findByText, getByText } = render(
    <div>
      <Routes />
      <SnackbarMessage />
    </div>,
    { userAndSettings: true, stores: [snackbar] }
  );

  act(() => void mockAuthUser({ uid: 'testid' }));
  act(() => mockFirestore('settings/testid', { locale: 'en', categories: [] }));
  act(() => mockRaf.flush());

  expect(await findByText(/New update available/)).toBeInTheDocument();

  fireEvent.click(getByText('Update Now'));
  expect(window.swStates.updateAndReload).toHaveBeenCalled();
});
