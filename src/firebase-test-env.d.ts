import * as firebase from 'firebase/app';

/**
 * Augment firebase with mock related functions
 */
declare module 'firebase/app' {
  const setError: (error?: any) => void;
  const setAuthState: (user?: firebase.User | null) => void;
}
