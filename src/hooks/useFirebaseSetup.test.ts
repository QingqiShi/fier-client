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

test('returns ready state that becomes true after first auth state change', () => {
  const { result } = renderHook(useFirebaseSetup, [user]);
  expect(result.current).toBe(false);

  act(() => {
    mockAuthState({
      email: 'email',
      displayName: 'name',
      emailVerified: true,
    });
  });
  expect(result.current).toBe(true);

  act(() => {
    mockAuthState(null);
  });
  expect(result.current).toBe(true);
});

test('sets language code', () => {
  renderHook(useFirebaseSetup, [], { translations: true });
  expect(mockAuth().languageCode).toBe('en');
});
