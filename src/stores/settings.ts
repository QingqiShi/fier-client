import { createStore } from 'libs/lit-firestore';
import { Locale } from 'stores/i18n';
import user from 'stores/user';
import { getLocale } from 'hooks/useRoute';

export type Category = { name: string };

const initialState = {
  locale: getLocale(window.location.pathname),
  categories: [] as Category[]
};
type State = typeof initialState;

const mutations = {
  setCategories: (_: State, newCategories: Category[]) => ({
    categories: newCategories
  }),
  setLocale: (_: State, newLocale: Locale) => ({
    locale: newLocale
  })
};

const usePath = () => {
  const [userState] = user.useStore();
  return userState.isLoggedIn && `settings/${userState.uid}`;
};

const store = createStore(initialState, mutations, usePath);

export default store;
