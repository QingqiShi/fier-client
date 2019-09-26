import { createStore } from 'react-lit-store';

const initialState = {
  isLoggedIn: false,
  uid: '',
  name: '',
  email: '',
  emailVerified: false
};
type State = typeof initialState;

const mutations = {
  setUser: (
    _: State,
    {
      uid,
      email,
      name,
      emailVerified
    }: { uid: string; email: string; name: string; emailVerified: boolean }
  ) => ({
    uid,
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
