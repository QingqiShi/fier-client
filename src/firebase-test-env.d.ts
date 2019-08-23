import * as firebase from 'firebase/app';

/**
 * Augment firebase with mock related functions
 */
declare module 'firebase/app' {
  const setError: (error?: any) => void;
  const setAuthState: (user?: firebase.User | null) => void;
  const authFunctions: {
    createUserWithEmailAndPassword: jest.fn<Promise<any>, []>;
    signInWithEmailAndPassword: jest.fn<Promise<any>, []>;
    onAuthStateChanged: jest.fn<void, []>;
  };
}
