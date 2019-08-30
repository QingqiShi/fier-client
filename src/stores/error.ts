import { createStore } from 'react-lit-store';

export type State = {
  hasError: boolean;
  errorMessage: string;
};

const mutations = {
  setError: (prevState: State, error: string) => ({
    hasError: true,
    errorMessage: error
  }),
  clearError: (prevState: State) => ({
    hasError: false
  })
};

const store = createStore({ hasError: false, errorMessage: '' }, mutations);

export default store;
