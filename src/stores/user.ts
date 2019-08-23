import { createStore } from 'libs/lit-store';

export type State = {
  isLoggedIn: boolean;
  name: string;
  email: string;
  emailVerified: boolean;
};

const mutations = {
  setUser: (
    _: State,
    {
      email,
      name,
      emailVerified
    }: { email: string; name: string; emailVerified: boolean }
  ) => ({
    isLoggedIn: true,
    email,
    name,
    emailVerified: !!emailVerified
  }),
  signOut: () => ({
    isLoggedIn: false
  }),
  updateUser: (_: State, name: string) => ({
    name
  })
};

const store = createStore(
  { isLoggedIn: false, name: '', email: '', emailVerified: false },
  mutations
);

export default store;
