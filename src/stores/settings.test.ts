import { useEffect } from 'react';
import { act } from '@testing-library/react-hooks';
import { renderHook } from 'testUtils';
import { firestore } from 'firebase/app';
import user from './user';
import settings from './settings';

beforeEach(jest.clearAllMocks);

function setupWithUser() {
  return renderHook(() => settings.useStore(), [settings, user], {
    useHook: () => {
      const [, userActions] = user.useStore();
      useEffect(() => {
        userActions.setUser({
          uid: 'testUserId',
          email: 'testEmail',
          name: 'testName',
          emailVerified: true
        });
      }, [userActions]);
    }
  });
}

test('use default state without logged in user', () => {
  const { result } = renderHook(() => settings.useStore(), [settings, user]);
  const initialState = { locale: 'en' };
  expect(result.current[0]).toEqual(initialState);
});

test('use correct document based on user id', () => {
  setupWithUser();
  expect(firestore().doc).toHaveBeenCalledWith('settings/testUserId');
});

test('get and set locale', () => {
  const { result } = setupWithUser();
  const setSnapshot = (firestore().doc('').onSnapshot as jest.Mock).mock
    .calls[0][0];
  act(() =>
    setSnapshot({
      exists: true,
      data: () => ({
        locale: 'zh',
        categories: []
      })
    })
  );

  // Get locale
  expect(result.current[0].locale).toEqual('zh');

  // Set locale
  act(() => result.current[1].setLocale('en'));
  expect(result.current[0].locale).toEqual('en');
});

test.skip('get and set categories', () => {});

describe('user', () => {
  describe('actions', () => {
    it.skip('setUser', () => {
      const { result } = renderHook(() => user.useStore(), [user]);
      act(() => {
        result.current[1].setUser({
          uid: 'testUserId',
          email: 'testEmail',
          name: 'testName',
          emailVerified: true
        });
      });
      expect(result.current[0].isLoggedIn).toBe(true);
      expect(result.current[0].uid).toEqual('testUserId');
      expect(result.current[0].email).toEqual('testEmail');
      expect(result.current[0].name).toEqual('testName');
      expect(result.current[0].emailVerified).toBe(true);
    });
  });
});
