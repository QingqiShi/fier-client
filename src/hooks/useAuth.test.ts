import { renderHook } from 'testUtils';
import { auth as mockAuth, mockAuthState } from 'firebase/app';
import useAuth from './useAuth';

const mockUserStore = [
  { mockUserState: true },
  {
    setInitialState: jest.fn(),
    setUser: jest.fn(),
    signOut: jest.fn()
  }
];
jest.mock('stores/user', () => ({
  Provider({ children }: React.PropsWithChildren<{}>) {
    return children;
  },
  useStore: jest.fn(() => mockUserStore)
}));

describe('useAuth', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('listen for auth state change', () => {
    renderHook(() => useAuth());
    expect(mockAuth().onAuthStateChanged).toHaveBeenCalledTimes(1);

    renderHook(() => useAuth());
    renderHook(() => useAuth());
    expect(mockAuth().onAuthStateChanged).toHaveBeenCalledTimes(1);
  });

  it('sets language code', () => {
    renderHook(() => useAuth());
    expect(mockAuth().languageCode).toEqual('en');
  });

  it('calls user actions on user sign in', () => {
    renderHook(() => useAuth());
    const mockUser = {
      email: 'email',
      displayName: 'name',
      emailVerified: true
    };

    mockAuthState(mockUser);
    expect(mockUserStore[1].setInitialState).toHaveBeenCalled();
    expect(mockUserStore[1].setUser).toHaveBeenCalledWith({
      email: mockUser.email,
      name: mockUser.displayName,
      emailVerified: mockUser.emailVerified
    });
  });

  it('calls user actions on user sign out', () => {
    renderHook(() => useAuth());

    mockAuthState(null);
    expect(mockUserStore[1].setInitialState).toHaveBeenCalled();
    expect(mockUserStore[1].signOut).toHaveBeenCalled();
  });
});
