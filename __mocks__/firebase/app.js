let error = false;
let authStateChangeCallback = user => {};

export const setError = e => {
  error = e;
};

export const setAuthState = user => {
  authStateChangeCallback(user);
};

export const authFunctions = {
  createUserWithEmailAndPassword: jest.fn(() =>
    error ? Promise.reject(error) : Promise.resolve()
  ),
  signInWithEmailAndPassword: jest.fn(() =>
    error ? Promise.reject(error) : Promise.resolve()
  ),
  signOut: jest.fn(() => (error ? Promise.reject(error) : Promise.resolve())),
  onAuthStateChanged: jest.fn(callback => {
    authStateChangeCallback = callback;
  })
};

export const auth = jest.fn(() => authFunctions);
