import React, { useEffect } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { RenderOptions, render as rtlRender } from '@testing-library/react';
import { Store, useStoreProvider } from 'react-lit-store';
import {
  RenderHookOptions,
  renderHook as rhtlRenderHook
} from '@testing-library/react-hooks';
import { RouteProvider } from 'libs/route-provider';
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
    return (
      <MemoryRouter initialEntries={[(options && options.url) || '/']}>
        <RouteProvider>
          <Provider>
            {options && !options.translations ? (
              children
            ) : (
              <App>{children}</App>
            )}
          </Provider>
        </RouteProvider>
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
  options?: RenderHookOptions<P> & { translations?: boolean; url?: string }
) {
  function Wrapper({ children }: { children: React.ReactElement }) {
    const Provider = useStoreProvider(i18n, ...stores);
    return (
      <MemoryRouter initialEntries={[(options && options.url) || '/']}>
        <RouteProvider>
          <Provider>
            {options && !options.translations ? (
              children
            ) : (
              <App>{children}</App>
            )}
          </Provider>
        </RouteProvider>
      </MemoryRouter>
    );
  }

  return rhtlRenderHook(callback, {
    wrapper: Wrapper as React.FunctionComponent,
    ...options
  });
}
