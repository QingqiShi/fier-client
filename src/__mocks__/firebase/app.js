/* ======
  Error Mocks
====== */
let error = false;
export const mockError = (e) => {
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
  onAuthStateChanged: jest.fn((callback) => {
    authStateChangeCallback = callback;
  }),
  signOut: jest.fn(() => (error ? Promise.reject(error) : Promise.resolve())),
  currentUser: null,
  languageCode: '',
};

export const mockAuthState = (user) => {
  authStateChangeCallback(user);
  authObj.currentUser = user;
};

export const auth = jest.fn(() => authObj);

auth.EmailAuthProvider = {
  credential: jest.fn(),
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
      data: () => data,
    });
  }
};

let newDocId = 0;
const mockFirestoreDB = {
  doc: jest.fn((path) => ({
    onSnapshot: (handler) => {
      docSnapshotChangeCallbacks[path] = handler;
    },
    set: (data, opts = {}) => {
      states[path] = opts.merge ? { ...states[path], ...data } : data;
      docSnapshotChangeCallbacks[path]({
        exists: true,
        data: () => states[path],
      });
    },
    get: () => ({
      exists: true,
      data: () => states[path],
    }),
    _getPath: () => path,
  })),
  collection: jest.fn((path) => ({
    doc: (name) => {
      if (name) {
        return {
          exists: !!states[`${path}/${name}`],
          data: () => states[`${path}/${name}`],
          _getPath: () => `${path}/${name}`,
        };
      }
      return {
        exists: false,
        data: () => undefined,
        _getPath: () => `${path}/${++newDocId}`,
      };
    },
  })),
  runTransaction: jest.fn((callback) => {
    return callback({
      get: (docRef) =>
        Promise.resolve({
          exists: !!states[docRef._getPath()],
          data: () => states[docRef._getPath()],
        }),
      set: (docRef, data, opts = {}) =>
        mockDocSnapshot(
          docRef._getPath(),
          opts.merge ? { ...states[docRef._getPath()], ...data } : data
        ),
      update: (docRef, data) =>
        mockDocSnapshot(docRef._getPath(), {
          ...states[docRef._getPath()],
          ...data,
        }),
    });
  }),
};

export const firestore = jest.fn(() => mockFirestoreDB);

export function clearFirestoreStates() {
  states = {};
  docSnapshotChangeCallbacks = {};
}

export function getMockFirestore(path) {
  return states[path];
}
