import { act } from '@testing-library/react-hooks';
import dayjs from 'dayjs';
import {
  clearFirestore,
  getFirestore,
  mockAuthUser,
  mockFirestore,
  renderHook,
} from 'testUtils';
import useTransaction from './useTransaction';

afterEach(clearFirestore);

test('expense transaction', async () => {
  const { result } = renderHook(() => useTransaction(), {
    userAndSettings: true,
  });

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`users/${userId}/settings/app`, {
      locale: 'en',
      accounts: [{ id: 1 }],
      categories: [{ id: 1, name: 'Test', emoji: 'T', type: 'expenses' }],
    })
  );

  await act(() =>
    result.current({
      value: 12.5,
      fromAccountId: 1,
      toAccountId: null,
      categoryId: 1,
      dateTime: dayjs(),
      notes: '',
    })
  );

  expect(getFirestore(`users/${userId}/accounts/1`)).toEqual({
    balance: -12.5,
  });
  expect(getFirestore(`users/${userId}/transactions/1`)).toEqual({
    fromAccountId: 1,
    toAccountId: null,
    categoryId: 1,
    value: 12.5,
    dateTime: expect.any(Number),
    notes: '',
  });
});

test('income transaction', async () => {
  const { result } = renderHook(() => useTransaction(), {
    userAndSettings: true,
  });

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`users/${userId}/settings/app`, {
      locale: 'en',
      accounts: [{ id: 1 }],
      categories: [{ id: 1, name: 'Test', emoji: 'T', type: 'expenses' }],
    })
  );

  await act(() =>
    result.current({
      value: 12.5,
      fromAccountId: null,
      toAccountId: 1,
      categoryId: 1,
      dateTime: dayjs(),
      notes: '',
    })
  );

  expect(getFirestore(`users/${userId}/accounts/1`)).toEqual({
    balance: 12.5,
  });
  expect(getFirestore(`users/${userId}/transactions/1`)).toEqual({
    fromAccountId: null,
    toAccountId: 1,
    categoryId: 1,
    value: 12.5,
    dateTime: expect.any(Number),
    notes: '',
  });
});

test('transfer transaction', async () => {
  const { result } = renderHook(() => useTransaction(), {
    userAndSettings: true,
  });

  const userId = 'testid';
  act(() => void mockAuthUser({ uid: userId }));
  act(() =>
    mockFirestore(`users/${userId}/settings/app`, {
      locale: 'en',
      accounts: [{ id: 1 }, { id: 2 }],
      categories: [{ id: 1, name: 'Test', emoji: 'T', type: 'expenses' }],
    })
  );

  await act(() =>
    result.current({
      value: 12.5,
      fromAccountId: 1,
      toAccountId: 2,
      categoryId: 1,
      dateTime: dayjs(),
      notes: '',
    })
  );

  expect(getFirestore(`users/${userId}/accounts/1`)).toEqual({
    balance: -12.5,
  });
  expect(getFirestore(`users/${userId}/accounts/2`)).toEqual({
    balance: 12.5,
  });
  expect(getFirestore(`users/${userId}/transactions/1`)).toEqual({
    fromAccountId: 1,
    toAccountId: 2,
    categoryId: 1,
    value: 12.5,
    dateTime: expect.any(Number),
    notes: '',
  });
});
