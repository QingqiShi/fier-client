import React, { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  RenderOptions,
  act,
  fireEvent,
  render as rtlRender,
} from '@testing-library/react';
import {
  RenderHookOptions,
  renderHook as rhtlRenderHook,
} from '@testing-library/react-hooks';
import { Store, useStoreProvider } from 'react-lit-store';
import { animated } from '@react-spring/web';
import { MockRaf } from '@react-spring/mock-raf';
import { ReactEventHandlers } from 'react-use-gesture/dist/types';
import { LocalizationProvider } from '@material-ui/pickers';
import DayJsUtils from '@material-ui/pickers/adapter/dayjs';
import {
  clearFirestoreStates,
  getMockFirestore,
  auth as mockAuth,
  mockAuthState,
  mockDocSnapshot,
  mockError,
  mockQuerySnapshot,
} from 'firebase/app';
import i18n from 'stores/i18n';
import settings from 'stores/settings';
import user from 'stores/user';
import FirebaseSetup from 'components/app/FirebaseSetup';
import en from 'translations/en.json';
import zh from 'translations/zh.json';

window.swStates = {
  updateAndReload: jest.fn(),
};

type Options = {
  translations?: boolean;
  userAndSettings?: boolean;
  url?: string;
  useHook?: () => void;
  stores?: Store<any, any>[];
};

function App({
  children,
  options,
}: React.PropsWithChildren<{ options?: Options }>) {
  const [, actions] = i18n.useStore();
  useEffect(() => {
    if (options?.translations !== false) {
      actions.addTranslations({ en, zh });
    }
  }, [actions, options]);
  const useHook = options?.useHook ?? (() => {});
  useHook();
  return <>{children}</>;
}

function createWrapper(options?: Options) {
  return ({ children }: React.PropsWithChildren<{}>) => {
    const Provider = useStoreProvider(
      i18n,
      ...(options?.stores ?? []),
      ...(options?.userAndSettings ? [settings, user] : [])
    );
    if (options?.userAndSettings) {
      return (
        <LocalizationProvider dateAdapter={DayJsUtils}>
          <MemoryRouter initialEntries={[options?.url ?? '/']}>
            <Provider>
              <FirebaseSetup>
                <App options={options}>{children}</App>
              </FirebaseSetup>
            </Provider>
          </MemoryRouter>
        </LocalizationProvider>
      );
    }
    return (
      <LocalizationProvider dateAdapter={DayJsUtils}>
        <MemoryRouter initialEntries={[options?.url ?? '/']}>
          <Provider>
            <App options={options}>{children}</App>
          </Provider>
        </MemoryRouter>
      </LocalizationProvider>
    );
  };
}

/**
 * React testing library render function wrapper.
 */
export function render(
  ui: React.ReactElement<any>,
  options?: RenderOptions & Options
) {
  return rtlRender(ui, { wrapper: createWrapper(options), ...options });
}

/**
 * Render custom hooks wrapped with lit-store providers.
 */
export function renderHook<P, R>(
  callback: (props: P) => R,
  options?: RenderHookOptions<P> & Options
) {
  return rhtlRenderHook(callback, {
    wrapper: createWrapper(options),
    ...options,
  });
}

export function renderSpringHook(useSpringHook: () => any) {
  function AnimatedDiv() {
    const styleProps = useSpringHook();
    return <animated.div {...styleProps}>el</animated.div>;
  }
  const result = rtlRender(<AnimatedDiv />);
  return {
    ...result,
    getEl: () => result.getByText('el'),
    rerender: () => result.rerender(<AnimatedDiv />),
  };
}

export function renderGestureHook(
  useGestureHook: () => () => ReactEventHandlers
) {
  function GestureDiv() {
    const bind = useGestureHook();
    return <div {...bind()}>test</div>;
  }
  const result = rtlRender(<GestureDiv />);
  return {
    ...result,
    getEl: () => result.getByText('test'),
    rerender: () => result.rerender(<GestureDiv />),
  };
}

export class DragUtil {
  x = 0;
  y = 0;
  rafStub: MockRaf;
  getEl: () => HTMLElement;

  constructor(getEl: () => HTMLElement, rafStub: MockRaf) {
    this.getEl = getEl;
    this.rafStub = rafStub;
  }

  dragStart() {
    fireEvent.touchStart(this.getEl(), {
      touches: [{ clientX: this.x, clientY: this.y }],
    });
    return this;
  }

  dragDown(distance: number) {
    this.y += distance;
    fireEvent.touchMove(this.getEl(), {
      touches: [{ clientX: this.x, clientY: this.y }],
    });
    return this;
  }

  dragUp(distance: number) {
    this.y -= distance;
    fireEvent.touchMove(this.getEl(), {
      touches: [{ clientX: this.x, clientY: this.y }],
    });
    return this;
  }

  dragEnd() {
    fireEvent.touchEnd(this.getEl(), {
      touches: [{ clientX: this.x, clientY: this.y }],
    });
    return this;
  }

  wait() {
    act(() => this.rafStub.flush());
    return this;
  }

  tick(step?: number) {
    act(() => this.rafStub.step({ count: step || 1 }));
    return this;
  }

  later(delay: number) {
    return new Promise((resolve) => setTimeout(resolve, delay));
  }
}

export function mockAuthUser(
  user?: {
    uid?: string;
    email?: string;
    displayName?: string;
    emailVerified?: boolean;
  } | null,
  error = ''
) {
  const mockUser =
    user === null
      ? null
      : {
          uid: 'testuid',
          email: 'test@test.com',
          displayName: 'testuser',
          emailVerified: true,
          updateProfile: jest.fn(() => Promise.resolve()),
          updateEmail: jest.fn(() => Promise.resolve()),
          updatePassword: jest.fn(() => Promise.resolve()),
          reauthenticateWithCredential: jest.fn(() => Promise.resolve()),
          ...user,
        };
  if (error) {
    mockError(error);
  }
  mockAuthState(mockUser);
  return mockUser;
}

export function clearAuthListeners() {
  mockAuth().onAuthStateChanged(() => {});
}

export function mockFirestore(path: string, data: any) {
  if (Array.isArray(data)) {
    mockQuerySnapshot(path, data);
  } else {
    mockDocSnapshot(path, data);
  }
}

export function clearFirestore() {
  clearFirestoreStates();
}

export const getFirestore = getMockFirestore;
