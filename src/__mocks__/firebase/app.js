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
let snapshotChangeCallbacks = {};

export const mockDocSnapshot = (path, data) => {
  states[path] = data;
  if (path in snapshotChangeCallbacks) {
    snapshotChangeCallbacks[path]({
      exists: !!data,
      data: () => data,
    });
  }
};

export const mockQuerySnapshot = (path, data) => {
  states[path] = data;
  if (path in snapshotChangeCallbacks) {
    snapshotChangeCallbacks[path]({
      forEach: (cb) => {
        data.forEach((x, i) =>
          cb({
            data: () => x,
            id: i,
          })
        );
      },
    });
  }
};

let newDocId = 0;
const mockFirestoreDB = {
  doc: jest.fn((path) => ({
    onSnapshot: (handler) => {
      snapshotChangeCallbacks[path] = handler;
    },
    set: (data, opts = {}) => {
      states[path] = opts.merge ? { ...states[path], ...data } : data;
      snapshotChangeCallbacks[path]({
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
  collection: jest.fn((path) => {
    const context = { orderBy: '', order: '', limit: 0 };
    const collectionObj = {
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
      orderBy: (field, order) => {
        context.orderBy = field;
        context.order = order;
        return collectionObj;
      },
      limit: (limit) => {
        context.limit = limit;
        return collectionObj;
      },
      onSnapshot: (handler) => {
        snapshotChangeCallbacks[path] = handler;
      },
    };
    return collectionObj;
  }),
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
  snapshotChangeCallbacks = {};
  newDocId = 0;
}

export function getMockFirestore(path) {
  return states[path];
}
