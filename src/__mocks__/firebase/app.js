let error = false;
let authStateChangeCallback = user => {};

export const mockError = e => {
  error = e;
};

export const mockAuthState = user => {
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
  }),
  languageCode: ''
};

export const auth = jest.fn(() => authFunctions);
