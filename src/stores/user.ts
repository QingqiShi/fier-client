import { createStore } from 'react-lit-store';

const initialState = {
  receivedInitialState: false,
  isLoggedIn: false,
  name: '',
  email: '',
  emailVerified: false
};
type State = typeof initialState;

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

const store = createStore(initialState, mutations);

export default store;
