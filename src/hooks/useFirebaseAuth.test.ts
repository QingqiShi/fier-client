import { renderHook } from 'testUtils';
import { act } from '@testing-library/react-hooks';
import { auth as mockAuth, mockAuthState } from 'firebase/app';
import user from 'stores/user';
import useFirebaseAuth from './useFirebaseAuth';

afterEach(() => {
  mockAuth().onAuthStateChanged(() => {});
  jest.clearAllMocks();
});

test('authentication actions', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useFirebaseAuth(), {
    stores: [user],
  });

  // Sign up creates user
  result.current.signUp({
    email: 'test@test.com',
    password: '12345',
    name: 'Test',
  });
  expect(mockAuth().createUserWithEmailAndPassword).toHaveBeenCalledWith(
    'test@test.com',
    '12345'
  );

  // Sign up sets display name
  const updateProfile = jest.fn(() => Promise.resolve());
  mockAuthState({ updateProfile });
  result.current.signUp({
    email: 'test@test.com',
    password: '12345',
    name: 'Test',
  });
  await waitForNextUpdate();
  expect(updateProfile).toHaveBeenCalledWith({ displayName: 'Test' });

  // Sign in with email and password
  result.current.signIn({
    email: 'test@test.com',
    password: '12345',
  });
  expect(mockAuth().signInWithEmailAndPassword).toHaveBeenCalledWith(
    'test@test.com',
    '12345'
  );

  // Sign out user
  result.current.signOut();
  expect(mockAuth().signOut).toHaveBeenCalled();
});

test('update user profile', async () => {
  const { result } = renderHook(() => useFirebaseAuth());

  // No user signed in
  mockAuthState(null);
  result.current.updateName('test name');
  result.current.updateEmail('test email', 'test');
  result.current.updatePassword('test password', 'test');

  // Sign in
  const mockUser = {
    email: 'test@test.com',
    updateProfile: jest.fn(() => Promise.resolve()),
    updateEmail: jest.fn(() => Promise.resolve()),
    updatePassword: jest.fn(() => Promise.resolve()),
    reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
  };
  mockAuthState(mockUser);

  // Update name
  result.current.updateName('test name');
  expect(mockUser.updateProfile).toHaveBeenCalledWith({
    displayName: 'test name',
  });

  // Update email
  await result.current.updateEmail('test email', 'test');
  expect(mockUser.updateEmail).toHaveBeenCalledWith('test email');

  // Update password
  await result.current.updatePassword('test password', 'test');
  expect(mockUser.updatePassword).toHaveBeenCalledWith('test password');
});

test('error while updating name', async () => {
  let state: ReturnType<typeof user['useStore']>[0] = null as any;
  const { result, waitForNextUpdate } = renderHook(() => useFirebaseAuth(), {
    stores: [user],
    useHook: () => {
      const [userState] = user.useStore();
      state = userState;
    },
  });

  mockAuthState({
    displayName: 'initial name',
    // Reject to throw error
    updateProfile: () => Promise.reject(),
  });

  // Update name
  act(() => {
    result.current.updateName('test name');
  });
  await waitForNextUpdate();

  expect(state && state.name).toBe('initial name');

  // No initial name
  mockAuthState({
    displayName: null,
    // Reject to throw error
    updateProfile: () => Promise.reject(),
  });

  // Update name
  act(() => {
    result.current.updateName('test name');
  });
  await waitForNextUpdate();

  expect(state && state.name).toBe('');
});
