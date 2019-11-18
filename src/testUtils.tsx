import React, { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import {
  RenderOptions,
  fireEvent,
  render as rtlRender
} from '@testing-library/react';
import { AnimatedValue, animated } from 'react-spring';
import { Store, useStoreProvider } from 'react-lit-store';
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

function AnimatedDiv({
  useSpringHook
}: {
  useSpringHook: () => AnimatedValue<any>;
}) {
  const styleProps = useSpringHook();
  return <animated.div style={styleProps}>test</animated.div>;
}

export function renderSpringHook(useSpringHook: () => AnimatedValue<any>) {
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
    el: result.getByText('test'),
    rerender: () =>
      result.rerender(<GestureDiv useGestureHook={useGestureHook} />)
  };
}

export async function dragStart(el: HTMLElement, wait: () => {}, y = 0) {
  fireEvent.touchStart(el, { touches: [{ clientX: 100, clientY: y }] });
  // await wait();
  // jest.runAllTimers();
  await wait();

  return {
    dragDown: (distance = 50) => dragDown(el, distance, wait, y),
    dragUp: (distance = 50) => dragUp(el, distance, wait, y),
    dragEnd: () => dragEnd(el, wait, y)
  };
}

export async function dragDown(
  el: HTMLElement,
  distance = 50,
  wait: () => {},
  y = 0
) {
  const newY = y + distance;
  fireEvent.touchMove(el, {
    touches: [{ clientX: 100, clientY: newY }]
  });
  // await wait();
  // jest.runAllTimers();
  await wait();
  return {
    dragDown: (distance = 50) => dragDown(el, distance, wait, newY),
    dragUp: (distance = 50) => dragUp(el, distance, wait, newY),
    dragEnd: () => dragEnd(el, wait, y)
  };
}

export async function dragUp(
  el: HTMLElement,
  distance = 50,
  wait: () => {},
  y = 0
) {
  const newY = y - distance;
  fireEvent.touchMove(el, {
    touches: [{ clientX: 100, clientY: newY }]
  });
  // await wait();
  // jest.runAllTimers();
  await wait();
  return {
    dragDown: (distance = 50) => dragDown(el, distance, wait, newY),
    dragUp: (distance = 50) => dragUp(el, distance, wait, newY),
    dragEnd: () => dragEnd(el, wait, y)
  };
}

export async function dragEnd(el: HTMLElement, wait: () => {}, y = 0) {
  fireEvent.touchEnd(el, {
    touches: [{ clientX: 100, clientY: y }]
  });
  await wait();
  // jest.runAllTimers();
}
