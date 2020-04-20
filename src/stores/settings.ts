import { createStore } from 'libs/lit-firestore';
import { Locale } from 'stores/i18n';
import user from 'stores/user';
import { getLocale } from 'libs/route-utils';

const initialState = {
  locale: getLocale(window.location.pathname),
  categories: [] as Settings.Category[],
  accounts: [] as Settings.Account[],
  ids: {
    categories: 0 as number | undefined,
    accounts: 0 as number | undefined,
  },
};

function setListSetting<T extends { id: number }>(
  state: typeof initialState,
  name: 'categories' | 'accounts',
  newItem: T
) {
  const list: T[] = state[name] as any;
  if (newItem.id) {
    return {
      [name]: list.map((item: any) =>
        item.id === newItem.id ? newItem : item
      ),
    };
  }
  return {
    [name]: [...state[name], { ...newItem, id: (state.ids[name] ?? 0) + 1 }],
    ids: { ...state.ids, [name]: (state.ids[name] ?? 0) + 1 },
  };
}

function removeListSetting(
  state: typeof initialState,
  name: 'categories' | 'accounts',
  id: number
) {
  const list: { id: number }[] = state[name];
  return { [name]: list.filter((item) => item.id !== id) };
}

const store = createStore(
  initialState,
  {
    setLocale: (_, newLocale: Locale) => ({
      locale: newLocale,
    }),
    setCategory: (state, newCategory: Settings.Category) =>
      setListSetting(state, 'categories', newCategory),
    removeCategory: (state, id: number) =>
      removeListSetting(state, 'categories', id),
    setAccount: (state, newAccount: Settings.Account) =>
      setListSetting(state, 'accounts', newAccount),
    removeAccount: (state, id: number) =>
      removeListSetting(state, 'accounts', id),
  },
  () => {
    const [{ isLoggedIn, uid }] = user.useStore();
    return isLoggedIn && `users/${uid}/settings/app`;
  }
);

export default store;
