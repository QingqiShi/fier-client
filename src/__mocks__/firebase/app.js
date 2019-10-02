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
export const mockAuthState = user => {
  authStateChangeCallback(user);
  authObj.currentUser = user;
};

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

export const auth = jest.fn(() => authObj);

auth.EmailAuthProvider = {
  credential: jest.fn()
};

/* ======
  Firestore Mocks
====== */

let state = {};
let docSnapshotChangeCallback = () => {};
export const mockDocSnapshot = snap => {
  state = snap.data();
  docSnapshotChangeCallback(snap);
};

const mockFirestoreDB = {
  doc: jest.fn(() => mockFirestoreDB),
  onSnapshot: jest.fn(handler => {
    docSnapshotChangeCallback = handler;
  }),
  set: jest.fn((data, opts = {}) => {
    state = opts.merge ? { ...state, ...data } : data;
    docSnapshotChangeCallback({
      data: () => state,
      exists: true
    });
  })
};

export const firestore = jest.fn(() => mockFirestoreDB);
