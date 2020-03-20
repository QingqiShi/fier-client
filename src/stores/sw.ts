import { createStore } from 'react-lit-store';

type State = {
  serviceWorkerUpdated: boolean;
  serviceWorkerRegistration?: ServiceWorkerRegistration;
};
const initialState: State = { serviceWorkerUpdated: false };

const mutations = {
  setUpdated: (_: State, reg: ServiceWorkerRegistration) => ({
    serviceWorkerUpdated: true,
    serviceWorkerRegistration: reg
  }),
  reload: (state: State) => {
    const registrationWaiting = state.serviceWorkerRegistration?.waiting;
    if (registrationWaiting) {
      registrationWaiting.postMessage({ type: 'SKIP_WAITING' });
      registrationWaiting.addEventListener('statechange', e => {
        if ((e.target as any)?.state === 'activated') {
          window.location.reload();
        }
      });
    }
    return {};
  }
};

const store = createStore<State, typeof mutations>(initialState, mutations);

export default store;
