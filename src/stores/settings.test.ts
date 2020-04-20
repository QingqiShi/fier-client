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
  const initialState = {
    locale: 'en',
    categories: [],
    accounts: [],
    ids: { categories: 0, accounts: 0 },
  };
  expect(result.current[0]).toEqual(initialState);
});

test('use correct document based on user id', () => {
  renderHookWithUser(() => settings.useStore(), UID);
  expect(firestore().doc).toHaveBeenCalledWith(`users/${UID}/settings/app`);
});

test('get and set locale', () => {
  const { result } = renderHookWithUser(() => settings.useStore(), UID);

  act(() =>
    mockFirestore(`users/${UID}/settings/app`, {
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
    mockFirestore(`users/${UID}/settings/app`, {
      locale: 'zh',
      categories: [],
      ids: { categories: 0 },
    })
  );

  // Get categories
  expect(result.current[0].categories).toEqual([]);

  // Add category and sets id
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
  const modifiedCategory = {
    id: 1,
    emoji: 'T',
    name: 'Test 2',
    type: 'income',
  };
  act(() => result.current[1].setCategory(modifiedCategory));
  expect(result.current[0].categories).toEqual([modifiedCategory]);

  // Remove category
  act(() => result.current[1].removeCategory(1));
  expect(result.current[0].categories).toEqual([]);
});

test('get, add, edit and remove accounts', () => {
  const { result } = renderHookWithUser(() => settings.useStore(), UID);

  act(() =>
    mockFirestore(`users/${UID}/settings/app`, {
      locale: 'zh',
      accounts: [],
      ids: {},
    })
  );

  // Get accounts
  expect(result.current[0].accounts).toEqual([]);

  // Add account and sets id
  act(() =>
    result.current[1].setAccount({
      id: 0,
      name: 'Monzo',
      type: 'normal',
      currency: 'gbp',
    })
  );
  expect(result.current[0].accounts).toEqual([
    {
      id: 1,
      name: 'Monzo',
      type: 'normal',
      currency: 'gbp',
    },
  ]);

  // Add another account
  act(() =>
    result.current[1].setAccount({
      id: 0,
      name: 'My Account',
      type: 'normal',
      currency: 'cny',
    })
  );
  expect(result.current[0].accounts).toEqual([
    {
      id: 1,
      name: 'Monzo',
      type: 'normal',
      currency: 'gbp',
    },
    {
      id: 2,
      name: 'My Account',
      type: 'normal',
      currency: 'cny',
    },
  ]);

  // Edit account
  const modifiedAccount = {
    id: 1,
    name: 'Monzo',
    type: 'debt',
    currency: 'usd',
  };
  act(() => result.current[1].setAccount(modifiedAccount));
  expect(result.current[0].accounts).toEqual([
    modifiedAccount,
    {
      id: 2,
      name: 'My Account',
      type: 'normal',
      currency: 'cny',
    },
  ]);

  // Remove category
  act(() => result.current[1].removeAccount(1));
  act(() => result.current[1].removeAccount(2));
  expect(result.current[0].accounts).toEqual([]);
});
