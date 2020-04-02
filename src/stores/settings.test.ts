import { useEffect } from 'react';
import { act } from '@testing-library/react-hooks';
import { mockFirestore, renderHook } from 'testUtils';
import { firestore } from 'firebase/app';
import user from './user';
import settings from './settings';

beforeEach(jest.clearAllMocks);

const UID = 'testUserId';

function renderHookWithUser(useHook: () => any, uid: string) {
  return renderHook(useHook, {
    stores: [settings, user],
    useHook: () => {
      const [, userActions] = user.useStore();
      useEffect(() => {
        userActions.setUser({
          uid,
          email: 'testEmail',
          name: 'testName',
          emailVerified: true,
        });
      }, [userActions]);
    },
  });
}

test('use default state without logged in user', () => {
  const { result } = renderHook(() => settings.useStore(), {
    stores: [settings, user],
  });
  const initialState = { locale: 'en', categories: [], ids: { categories: 0 } };
  expect(result.current[0]).toEqual(initialState);
});

test('use correct document based on user id', () => {
  renderHookWithUser(() => settings.useStore(), UID);
  expect(firestore().doc).toHaveBeenCalledWith('settings/testUserId');
});

test('get and set locale', () => {
  const { result } = renderHookWithUser(() => settings.useStore(), UID);

  act(() =>
    mockFirestore(`settings/${UID}`, {
      locale: 'zh',
      categories: [],
      ids: { categories: 0 },
    })
  );

  // Get locale
  expect(result.current[0].locale).toEqual('zh');

  // Set locale
  act(() => result.current[1].setLocale('en'));
  expect(result.current[0].locale).toEqual('en');
});

test('get, add, edit and remove categories', () => {
  const { result } = renderHookWithUser(() => settings.useStore(), UID);

  act(() =>
    mockFirestore(`settings/${UID}`, {
      locale: 'zh',
      categories: [],
      ids: { categories: 0 },
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
      type: 'income',
    })
  );
  expect(result.current[0].categories).toEqual([
    {
      id: 1,
      emoji: 'T',
      name: 'Test',
      type: 'income',
    },
  ]);

  // Edit category
  act(() =>
    result.current[1].setCategory({
      id: 1,
      emoji: 'T',
      name: 'Test 2',
      type: 'income',
    })
  );
  expect(result.current[0].categories).toEqual([
    {
      id: 1,
      emoji: 'T',
      name: 'Test 2',
      type: 'income',
    },
  ]);

  // Remove category
  act(() => result.current[1].removeCategory(1));
  expect(result.current[0].categories).toEqual([]);
});
