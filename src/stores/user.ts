import { createStore } from 'react-lit-store';

export type State = {
  receivedInitialState: boolean;
  isLoggedIn: boolean;
  name: string;
  email: string;
  emailVerified: boolean;
};

const mutations = {
  setInitialState: () => ({
    receivedInitialState: true
  }),
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
  {
    receivedInitialState: false,
    isLoggedIn: false,
    name: '',
    email: '',
    emailVerified: false
  },
  mutations
);

export default store;
