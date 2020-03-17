/* ======
  Error Mocks
====== */
let error = false;
export const mockError = e => {
  error = e;
};

/* ======
  Auth Mocks
====== */

let authStateChangeCallback = () => {};

const authObj = {
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
  signOut: jest.fn(() => (error ? Promise.reject(error) : Promise.resolve())),
  currentUser: null,
  languageCode: ''
};

export const mockAuthState = user => {
  authStateChangeCallback(user);
  authObj.currentUser = user;
};

export const auth = jest.fn(() => authObj);

auth.EmailAuthProvider = {
  credential: jest.fn()
};

/* ======
  Firestore Mocks
====== */

let states = {};
let docSnapshotChangeCallbacks = {};
export const mockDocSnapshot = (path, data) => {
  states[path] = data;
  if (path in docSnapshotChangeCallbacks) {
    docSnapshotChangeCallbacks[path]({
      exists: !!data,
      data: () => data
    });
  }
};

const mockFirestoreDB = {
  doc: jest.fn(path => ({
    onSnapshot: jest.fn(handler => {
      docSnapshotChangeCallbacks[path] = handler;
    }),
    set: jest.fn((data, opts = {}) => {
      states[path] = opts.merge ? { ...states[path], ...data } : data;
      docSnapshotChangeCallbacks[path]({
        exists: true,
        data: () => states[path]
      });
    })
  }))
};

export const firestore = jest.fn(() => mockFirestoreDB);

export function clearFirestoreStates() {
  states = {};
  docSnapshotChangeCallbacks = {};
}
