import React, { useEffect } from 'react';
import { Router } from 'react-router-dom';
import { render as rtlRender, RenderOptions } from '@testing-library/react';
import {
  renderHook as rhtlRenderHook,
  RenderHookOptions
} from '@testing-library/react-hooks';
import { createMemoryHistory } from 'history';
import { useStoreProvider, Store } from 'libs/lit-store';
import i18n from 'stores/i18n';
import en from 'translations/en.json';

/**
 * Wrapper component that fetches English translations.
 */
function App({ children }: React.PropsWithChildren<{}>) {
  const [, actions] = i18n.useStore();
  useEffect(() => {
    actions.addTranslations({ en });
  }, [actions]);

  return <>{children}</>;
}

/**
 * Render elements wrapped with lit-store providers.
 */
export function render(
  ui: React.ReactElement<any>,
  stores: Store<any, any>[] = [],
  options?: RenderOptions & { translations?: boolean; url?: string }
) {
  function Wrapper({ children }: React.PropsWithChildren<{}>) {
    const Provider = useStoreProvider(i18n, ...stores);
    const inner = (
      <Provider>
        {options && !options.translations ? children : <App>{children}</App>}
      </Provider>
    );

    if (options && options.url) {
      return (
        <Router
          history={createMemoryHistory({ initialEntries: [options.url] })}
        >
          {inner}
        </Router>
      );
    } else {
      return inner;
    }
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
  options?: RenderHookOptions<P> & { translations?: boolean; url?: string }
) {
  function Wrapper({ children }: { children: React.ReactElement }) {
    const Provider = useStoreProvider(i18n, ...stores);
    const inner = (
      <Provider>
        {options && !options.translations ? children : <App>{children}</App>}
      </Provider>
    );
    if (options && options.url) {
      return (
        <Router
          history={createMemoryHistory({ initialEntries: [options.url] })}
        >
          {inner}
        </Router>
      );
    } else {
      return inner;
    }
  }

  return rhtlRenderHook(callback, {
    wrapper: Wrapper as React.FunctionComponent,
    ...options
  });
}

/**
 * Utility function that flushes any pending promise.
 */
export function flushPromise() {
  return new Promise(resolve => setImmediate(resolve));
}
