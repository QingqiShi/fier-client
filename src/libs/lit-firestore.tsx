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

    const actions = useMemo(() => {
      const result = {} as Actions<M>;
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

          const keys = Object.keys(state) as (keyof S)[];
          if (typeof keys.find(key => !(key in data)) !== 'undefined') {
            let delta: Partial<S> = {};
            keys.forEach(key => {
              if (!(key in data)) {
                delta[key] = state[key];
              }
            });
            doc.set(delta, { merge: true });
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
