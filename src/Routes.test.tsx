import React from 'react';
import { useHistory } from 'react-router-dom';
import { act, fireEvent, waitFor } from '@testing-library/react';
import createMockRaf, { MockRaf } from '@react-spring/mock-raf';
import { FrameLoop, Globals } from '@react-spring/web';
import dayjs from 'dayjs';
import {
  clearAuthListeners,
  mockAuthUser,
  mockFirestore,
  render,
} from 'testUtils';
import SnackbarMessage from 'components/app/SnackbarMessage';
import snackbar from 'stores/snackbar';
import Routes from './Routes';

// Load files upfront to suppress lazy load
import('components/views/Dashboard');
import('components/views/Login');
import('components/views/Register');

let mockRaf: MockRaf;
beforeEach(() => {
  mockRaf = createMockRaf();
  Globals.assign({
    now: mockRaf.now,
    requestAnimationFrame: mockRaf.raf,
    cancelAnimationFrame: mockRaf.cancel,
    frameLoop: new FrameLoop(),
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
  const { findAllByText, findByTestId } = render(<Routes />, {
    userAndSettings: true,
  });

  act(() => void mockAuthUser({ uid: 'testid' }));
  act(() =>
    mockFirestore('users/testid/settings/app', {
      locale: 'zh',
      categories: [1],
    })
  );

  fireEvent.click(await findByTestId('topnav-profile'));
  expect((await findAllByText('用户')).length).toBeGreaterThan(0);
});

test('renders logged in user', async () => {
  const { getByTestId } = render(<Routes />, { userAndSettings: true });

  act(() => void mockAuthUser({ uid: 'testid' }));
  act(() =>
    mockFirestore('users/testid/settings/app', {
      locale: 'en',
      categories: [1],
    })
  );

  await waitFor(() => {
    getByTestId('topnav-profile');
  });
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
  act(() =>
    mockFirestore('users/testid/settings/app', { locale: 'en', categories: [] })
  );
  act(() => mockRaf.flush());

  expect(await findByText(/New update available/)).toBeInTheDocument();

  fireEvent.click(getByText('Update Now'));
  expect(window.swStates.updateAndReload).toHaveBeenCalled();
});

test('show modals based on url hash', async () => {
  const historyRef: {
    history: any;
  } = { history: null };
  const { getByText } = render(<Routes />, {
    userAndSettings: true,
    useHook: () => {
      historyRef.history = useHistory();
    },
  });

  // Login user
  act(
    () =>
      void mockAuthUser({
        uid: 'testid',
      })
  );

  // Manage categories
  act(() => historyRef.history.push('#manageCategories'));
  await waitFor(() => {
    expect(getByText('Categories')).toBeInTheDocument();
  });

  // Create account
  act(() => historyRef.history.push('#createAccount'));
  await waitFor(() => {
    expect(getByText('Add Account')).toBeInTheDocument();
  });

  // Create transaction
  act(() => historyRef.history.push('#new'));
  await waitFor(() => {
    expect(getByText('New Transaction')).toBeInTheDocument();
  });
});
