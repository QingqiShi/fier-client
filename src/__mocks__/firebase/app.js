let error = false;
let authStateChangeCallback = user => {};

export const mockAuthFunctions = {
  createUserWithEmailAndPassword: jest.fn(() =>
    error
      ? Promise.reject(error)
      : Promise.resolve({ user: authObj.currentUser })
  ),
  signInWithEmailAndPassword: jest.fn(() =>
    error ? Promise.reject(error) : Promise.resolve()
  ),
  onAuthStateChanged: jest.fn(callback => {
    authStateChangeCallback = callback;
  }),
  signOut: jest.fn(() => (error ? Promise.reject(error) : Promise.resolve()))
};

const authObj = {
  ...mockAuthFunctions,
  currentUser: null,
  languageCode: ''
};

export const auth = jest.fn(() => authObj);

auth.EmailAuthProvider = {
  credential: jest.fn()
};

export const mockError = e => {
  error = e;
};

export const mockAuthState = user => {
  authStateChangeCallback(user);
  authObj.currentUser = user;
};
