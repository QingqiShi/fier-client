import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState
} from 'react';
import { Actions, Mutations, Store, StoreContext } from 'react-lit-store';
import { firestore } from 'firebase/app';

function getEmptyActions<S, M extends Mutations<S>>(mutations: M) {
  const actions: Actions<M> = {} as any;
  Object.keys(mutations).forEach((name: keyof M) => {
    actions[name] = () => {};
  });
  return actions;
}

/**
 * Create a lit-store instance with the initial state and reducer.
 * @param initialState Initial store state
 * @param reducer Reducer to mutate state
 * @returns Store instance with `Provider` component and `useStore` hook.
 */
export function createStore<S, M extends Mutations<S>>(
  initialState: S,
  mutations: M,
  usePath: () => string | false
): Store<S, M> {
  const context: StoreContext<S, Actions<M>> = createContext([
    initialState,
    getEmptyActions<S, M>(mutations)
  ]);

  function Provider({ children }: React.PropsWithChildren<{}>) {
    const path = usePath();
    const [state, setState] = useState(initialState);
    const db = useMemo(() => firestore(), []);
    const doc = useMemo(() => (path ? db.doc(path) : undefined), [db, path]);
    const handleSnap = useRef((_snap: firestore.DocumentSnapshot) => {});

    const actions: Actions<M> = useMemo(() => {
      const result: Actions<M> = {} as any;
      Object.keys(mutations).forEach((name: keyof M) => {
        result[name] = (...args) => {
          const delta = mutations[name](state, ...args);
          if (!doc) {
            setState({ ...state, ...delta });
          } else {
            doc.set(delta, { merge: true });
          }
        };
      });
      return result;
    }, [doc, state]);

    useEffect(() => {
      if (!doc) {
        handleSnap.current = (_snap: firestore.DocumentSnapshot) => {};
      } else {
        handleSnap.current = snap => {
          const data = snap.data();

          if (!snap.exists || !data) {
            doc.set(state);
            return;
          }

          const keys = Object.keys(state);
          if (typeof keys.find(key => !(key in data)) !== 'undefined') {
            keys.forEach(key => {
              if (!(key in data)) {
                doc.set({ [key]: state[key as keyof S] }, { merge: true });
              }
            });
            return;
          }

          setState(data as any);
        };
      }
    }, [doc, state]);

    useEffect(() => {
      if (!doc) return;
      return doc.onSnapshot(handleSnap.current);
    }, [doc]);

    return (
      <context.Provider value={[state, actions]}>{children}</context.Provider>
    );
  }

  function useStore() {
    return useContext(context);
  }

  return { Provider, useStore };
}
