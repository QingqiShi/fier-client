import { createStore } from 'libs/lit-firestore';
import { Locale } from 'stores/i18n';
import user from 'stores/user';
import { getLocale } from 'libs/route-utils';

export type Category = { name: string };

const initialState = {
  locale: getLocale(window.location.pathname)
};
type State = typeof initialState;

const mutations = {
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
