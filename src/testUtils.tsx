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
import zh from 'translations/zh.json';

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
        <RouteProvider>
          <Provider>
            <App
              translations={options && options.translations}
              useHook={options && options.useHook}
            >
              {children}
            </App>
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
  options?: RenderHookOptions<P> & Options
) {
  function Wrapper({ children }: { children: React.ReactElement }) {
    const Provider = useStoreProvider(i18n, ...stores);
    return (
      <MemoryRouter initialEntries={[(options && options.url) || '/']}>
        <RouteProvider>
          <Provider>
            <App
              translations={options && options.translations}
              useHook={options && options.useHook}
            >
              {children}
            </App>
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
