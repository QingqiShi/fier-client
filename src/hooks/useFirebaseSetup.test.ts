import { act } from '@testing-library/react-hooks';
import { renderHook } from 'testUtils';
import { auth as mockAuth, mockAuthState } from 'firebase/app';
import user from 'stores/user';
import useFirebaseSetup from './useFirebaseSetup';

afterEach(() => {
  mockAuth().onAuthStateChanged(() => {});
  jest.clearAllMocks();
});

test('subscribe to auth state change when passed true as argument', () => {
  renderHook(useFirebaseSetup);
  expect(mockAuth().onAuthStateChanged).toHaveBeenCalledTimes(1);
});

test('returns user state and updates on auth state change', () => {
  const { result } = renderHook(useFirebaseSetup, [user]);
  expect(result.current.isLoggedIn).toBe(false);

  act(() => {
    mockAuthState({
      email: 'email',
      displayName: 'name',
      emailVerified: true
    });
  });
  expect(result.current.isLoggedIn).toBe(true);
  expect(result.current.email).toBe('email');
  expect(result.current.name).toBe('name');
  expect(result.current.emailVerified).toBe(true);

  act(() => {
    mockAuthState({
      email: 'test@email.com'
    });
  });
  expect(result.current.name).toBe('test');

  act(() => {
    mockAuthState(null);
  });
  expect(result.current.isLoggedIn).toBe(false);
});

test('sets language code', () => {
  renderHook(useFirebaseSetup, [], { translations: true });
  expect(mockAuth().languageCode).toBe('en');
});
