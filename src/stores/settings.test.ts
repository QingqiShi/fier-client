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
  const initialState = { locale: 'en', categories: [], ids: { categories: 0 } };
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
        categories: [],
        ids: { categories: 0 }
      })
    })
  );

  // Get locale
  expect(result.current[0].locale).toEqual('zh');

  // Set locale
  act(() => result.current[1].setLocale('en'));
  expect(result.current[0].locale).toEqual('en');
});

test('get, add, edit and remove categories', () => {
  const { result } = setupWithUser();
  const setSnapshot = (firestore().doc('').onSnapshot as jest.Mock).mock
    .calls[0][0];
  act(() =>
    setSnapshot({
      exists: true,
      data: () => ({
        locale: 'zh',
        categories: [],
        ids: { categories: 0 }
      })
    })
  );

  // Get categories
  expect(result.current[0].categories).toEqual([]);

  // Add category
  act(() =>
    result.current[1].setCategory({
      id: 0,
      emoji: 'T',
      name: 'Test',
      type: 'income'
    })
  );
  expect(result.current[0].categories).toEqual([
    {
      id: 1,
      emoji: 'T',
      name: 'Test',
      type: 'income'
    }
  ]);

  // Edit category
  act(() =>
    result.current[1].setCategory({
      id: 1,
      emoji: 'T',
      name: 'Test 2',
      type: 'income'
    })
  );
  expect(result.current[0].categories).toEqual([
    {
      id: 1,
      emoji: 'T',
      name: 'Test 2',
      type: 'income'
    }
  ]);

  // Remove category
  act(() => result.current[1].removeCategory(1));
  expect(result.current[0].categories).toEqual([]);
});
