import { act } from '@testing-library/react-hooks';
import { renderHook } from 'testUtils';
import { auth as mockAuth, mockAuthState } from 'firebase/app';
import user from 'stores/user';
import useAuth from './useAuth';

afterEach(() => {
  mockAuth().onAuthStateChanged(() => {});
  jest.clearAllMocks();
});

test('subscribe to auth state change when passed true as argument', () => {
  renderHook(() => useAuth());
  expect(mockAuth().onAuthStateChanged).not.toHaveBeenCalled();

  renderHook(() => useAuth(true));
  expect(mockAuth().onAuthStateChanged).toHaveBeenCalledTimes(1);
});

test('returns user state and updates on auth state change', () => {
  const { result } = renderHook(() => useAuth(true), [user]);
  expect(result.current.user.isLoggedIn).toBe(false);

  act(() => {
    mockAuthState({
      email: 'email',
      displayName: 'name',
      emailVerified: true
    });
  });
  expect(result.current.user.isLoggedIn).toBe(true);
  expect(result.current.user.email).toBe('email');
  expect(result.current.user.name).toBe('name');
  expect(result.current.user.emailVerified).toBe(true);

  act(() => {
    mockAuthState({
      email: 'test@email.com'
    });
  });
  expect(result.current.user.name).toBe('test');

  act(() => {
    mockAuthState(null);
  });
  expect(result.current.user.isLoggedIn).toBe(false);
});

test('authentication actions', async () => {
  const { result, waitForNextUpdate } = renderHook(() => useAuth(), [user]);

  // Sign up creates user
  result.current.signUp({
    email: 'test@test.com',
    password: '12345',
    name: 'Test'
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
    name: 'Test'
  });
  await waitForNextUpdate();
  expect(updateProfile).toHaveBeenCalledWith({ displayName: 'Test' });

  // Sign in with email and password
  result.current.signIn({
    email: 'test@test.com',
    password: '12345'
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
  const { result } = renderHook(() => useAuth());

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
    reauthenticateWithCredential: jest.fn(() => Promise.resolve())
  };
  mockAuthState(mockUser);

  result.current.updateName('test name');
  expect(mockUser.updateProfile).toHaveBeenCalledWith({
    displayName: 'test name'
  });

  await result.current.updateEmail('test email', 'test');
  expect(mockUser.updateEmail).toHaveBeenCalledWith('test email');

  await result.current.updatePassword('test password', 'test');
  expect(mockUser.updatePassword).toHaveBeenCalledWith('test password');
});
