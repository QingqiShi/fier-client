import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
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
): Store<S, M> & { useMeta: () => { loaded: boolean } } {
  const context: StoreContext<S, Actions<M>> = createContext([
    initialState,
    getEmptyActions<S, M>(mutations),
  ]);
  const firestoreContext = createContext({ loaded: false });

  function Provider({ children }: React.PropsWithChildren<{}>) {
    const path = usePath();
    const [state, setState] = useState(initialState);
    const [doc, setDoc] = useState<firestore.DocumentReference | undefined>();
    const handleSnap = useRef((_snap: firestore.DocumentSnapshot) => {});
    const [loaded, setLoaded] = useState(false);

    useEffect(() => {
      const fetchAndSetDoc = async (path: string) => {
        if (!firestore) await import('firebase/firestore');
        setDoc(firestore().doc(path));
      };
      if (path) fetchAndSetDoc(path);
    }, [path]);

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
        handleSnap.current = (snap) => {
          const data = snap.data();

          if (!snap.exists || !data) {
            doc.set(state);
            return;
          }

          const keys = Object.keys(state) as (keyof S)[];
          if (typeof keys.find((key) => !(key in data)) !== 'undefined') {
            let delta: Partial<S> = {};
            keys.forEach((key) => {
              if (!(key in data)) {
                delta[key] = state[key];
              }
            });
            doc.set(delta, { merge: true });
            return;
          }

          setState(data as any);
          setLoaded(true);
        };
      }
    }, [doc, state]);

    useEffect(() => {
      if (!doc) return;
      return doc.onSnapshot(handleSnap.current);
    }, [doc]);

    return (
      <context.Provider value={[state, actions]}>
        <firestoreContext.Provider value={{ loaded }}>
          {children}
        </firestoreContext.Provider>
      </context.Provider>
    );
  }

  function useStore() {
    return useContext(context);
  }

  function useMeta() {
    return useContext(firestoreContext);
  }

  return { Provider, useStore, useMeta };
}
