import React, { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  RenderOptions,
  act,
  fireEvent,
  render as rtlRender
} from '@testing-library/react';
import { animated } from '@react-spring/web';
import { Store, useStoreProvider } from 'react-lit-store';
import { MockRaf } from '@react-spring/mock-raf';
import {
  RenderHookOptions,
  renderHook as rhtlRenderHook
} from '@testing-library/react-hooks';
import i18n from 'stores/i18n';
import en from 'translations/en.json';
import zh from 'translations/zh.json';
import { ReactEventHandlers } from 'react-use-gesture/dist/types';

type Options = {
  translations?: boolean;
  url?: string;
  useHook?: () => void;
};

/**
 * Wrapper component that fetches English translations.
 */
function App({
  children,
  translations,
  useHook = () => {}
}: React.PropsWithChildren<{
  translations?: boolean;
  useHook?: Options['useHook'];
}>) {
  const [, actions] = i18n.useStore();
  useEffect(() => {
    if (translations !== false) {
      actions.addTranslations({ en, zh });
    }
  }, [actions, translations]);

  useHook();

  return <>{children}</>;
}

/**
 * Render elements wrapped with lit-store providers.
 */
export function render(
  ui: React.ReactElement<any>,
  stores: Store<any, any>[] = [],
  options?: RenderOptions & Options
) {
  function Wrapper({ children }: React.PropsWithChildren<{}>) {
    const Provider = useStoreProvider(i18n, ...stores);
    return (
      <MemoryRouter initialEntries={[(options && options.url) || '/']}>
        <Provider>
          <App
            translations={options && options.translations}
            useHook={options && options.useHook}
          >
            {children}
          </App>
        </Provider>
      </MemoryRouter>
    );
  }

  return rtlRender(ui, {
    wrapper: Wrapper as React.FunctionComponent,
    ...options
  });
}

/**
 * Render custom hooks wrapped with lit-store providers.
 */
export function renderHook<P, R>(
  callback: (props: P) => R,
  stores: Store<any, any>[] = [],
  options?: RenderHookOptions<P> & Options
) {
  function Wrapper({ children }: { children: React.ReactElement }) {
    const Provider = useStoreProvider(i18n, ...stores);
    return (
      <MemoryRouter initialEntries={[(options && options.url) || '/']}>
        <Provider>
          <App
            translations={options && options.translations}
            useHook={options && options.useHook}
          >
            {children}
          </App>
        </Provider>
      </MemoryRouter>
    );
  }

  return rhtlRenderHook(callback, {
    wrapper: Wrapper as React.FunctionComponent,
    ...options
  });
}

function AnimatedDiv({ useSpringHook }: { useSpringHook: () => any }) {
  const styleProps = useSpringHook();
  return <animated.div {...styleProps}>test</animated.div>;
}

export function renderSpringHook(useSpringHook: () => any) {
  const result = rtlRender(<AnimatedDiv useSpringHook={useSpringHook} />);
  return {
    ...result,
    el: result.getByText('test'),
    rerender: () =>
      result.rerender(<AnimatedDiv useSpringHook={useSpringHook} />)
  };
}

function GestureDiv({
  useGestureHook
}: {
  useGestureHook: () => () => ReactEventHandlers;
}) {
  const bind = useGestureHook();
  return <div {...bind()}>test</div>;
}

export function renderGestureHook(
  useGestureHook: () => () => ReactEventHandlers
) {
  const result = rtlRender(<GestureDiv useGestureHook={useGestureHook} />);
  return {
    ...result,
    getEl: () => result.getByText('test'),
    rerender: () =>
      result.rerender(<GestureDiv useGestureHook={useGestureHook} />)
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
      touches: [{ clientX: this.x, clientY: this.y }]
    });
    return this;
  }

  dragDown(distance: number) {
    this.y += distance;
    fireEvent.touchMove(this.getEl(), {
      touches: [{ clientX: this.x, clientY: this.y }]
    });
    return this;
  }

  dragUp(distance: number) {
    this.y -= distance;
    fireEvent.touchMove(this.getEl(), {
      touches: [{ clientX: this.x, clientY: this.y }]
    });
    return this;
  }

  dragEnd() {
    fireEvent.touchEnd(this.getEl(), {
      touches: [{ clientX: this.x, clientY: this.y }]
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
    return new Promise(resolve => setTimeout(resolve, delay));
  }
}
