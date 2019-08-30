import { createStore } from 'react-lit-store';

const initialState = { hasError: false, errorMessage: '' };
type State = typeof initialState;

const mutations = {
  setError: (_: State, error: string) => ({
    hasError: true,
    errorMessage: error
  }),
  clearError: (_: State) => ({
    hasError: false
  })
};

const store = createStore(initialState, mutations);

export default store;
