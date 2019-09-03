let error = false;
let currentUser = null;
let authStateChangeCallback = user => {};

export const mockError = e => {
  error = e;
};

export const mockAuthState = user => {
  authStateChangeCallback(user);
  currentUser = user;
};

export const mockAuthFunctions = {
  createUserWithEmailAndPassword: jest.fn(() =>
    error ? Promise.reject(error) : Promise.resolve({ user: currentUser })
  ),
  signInWithEmailAndPassword: jest.fn(() =>
    error ? Promise.reject(error) : Promise.resolve()
  ),
  onAuthStateChanged: jest.fn(callback => {
    authStateChangeCallback = callback;
  }),
  signOut: jest.fn(() => (error ? Promise.reject(error) : Promise.resolve()))
};

export const auth = jest.fn(() => ({
  ...mockAuthFunctions,
  currentUser,
  languageCode: ''
}));
auth.EmailAuthProvider = {
  credential: jest.fn()
};
