import React, { forwardRef } from 'react';
import {
  Route,
  Switch,
  Redirect,
  RouteProps,
  Link,
  RouteComponentProps
} from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import i18n, { Locale, locales } from 'stores/i18n';
import { Location } from 'history';

export function LocaleRouter({ children }: React.PropsWithChildren<{}>) {
  const [
    { locale: currentLocale, translations },
    i18nActions
  ] = i18n.useStore();
  const localesRegExp = `/:locale(${locales.join('|')})?`;

  const render = ({
    match,
    location
  }: RouteComponentProps<{ locale: Locale }>) => {
    const matchedLocale = match.params.locale;
    const locale = matchedLocale || locales[0];

    // First locale should be implicit
    if (matchedLocale === locales[0]) {
      return <LocaleRedirect to={location} locale={matchedLocale} />;
    }

    // fetch translation if not exist
    if (!Object.keys(translations[locale] || {}).length) {
      import(`translations/${locale}.json`).then(
        ({ default: translations }) => {
          i18nActions.addTranslations({ [locale]: translations });
        }
      );
      return null;
    }

    // Set current locale
    if (currentLocale !== locale) {
      i18nActions.setLocale(locale);
      return null;
    }

    return (
      <>
        <Helmet>
          <link
            rel="manifest"
            href={createLocaleUrl(locale, '/manifest.json')}
          />
        </Helmet>
        {children}
      </>
    );
  };

  return <Route path={localesRegExp} render={render} />;
}

export function LocaleRoute({ path, ...rest }: RouteProps) {
  const [{ locale }] = i18n.useStore();

  if (path) {
    return <Route path={resolvePath(locale, path)} {...rest} />;
  } else {
    return <Route {...rest} />;
  }
}

export function LocaleRedirect({
  to,
  locale
}: {
  to: string | Location<any>;
  locale?: Locale;
}) {
  const [{ locale: currentLocale }] = i18n.useStore();

  if (typeof to === 'string') {
    return <Redirect to={createLocaleUrl(locale || currentLocale, to)} />;
  }

  return (
    <Redirect
      to={{
        ...to,
        pathname: createLocaleUrl(locale || currentLocale, to.pathname)
      }}
    />
  );
}

export function LocaleSwitch({ children }: React.PropsWithChildren<{}>) {
  const [{ locale }] = i18n.useStore();

  if (children && children instanceof Array) {
    return (
      <Switch>
        {children.map(child =>
          child &&
          typeof child === 'object' &&
          'props' in child &&
          child.props.path
            ? {
                ...child,
                props: {
                  ...child.props,
                  path: resolvePath(locale, child.props.path)
                }
              }
            : child
        )}
      </Switch>
    );
  } else {
    return <Switch>{children}</Switch>;
  }
}

export const LocaleLink = forwardRef(
  (
    {
      children,
      className,
      to,
      locale
    }: React.PropsWithChildren<{
      className: string;
      to: string | Location<any>;
      locale?: Locale;
    }>,
    ref: React.Ref<HTMLAnchorElement>
  ) => {
    const [{ locale: currentLocale }] = i18n.useStore();

    if (typeof to === 'string') {
      return (
        <Link
          innerRef={ref}
          className={className}
          to={createLocaleUrl(locale || currentLocale, to)}
        >
          {children}
        </Link>
      );
    }

    return (
      <Link
        innerRef={ref}
        className={className}
        to={{
          ...to,
          pathname: createLocaleUrl(locale || currentLocale, to.pathname)
        }}
      >
        {children}
      </Link>
    );
  }
);

export function LocaleNormPath({
  render
}: {
  render: (path: string) => React.ReactNode;
}) {
  return (
    <Route
      render={({ location }) => {
        let path = location.pathname;

        locales.forEach(locale => {
          path = path.replace(new RegExp(`^/${locale}`), '');
        });

        return render(path);
      }}
    />
  );
}

export function resolvePath(locale: string, url: string | string[]) {
  if (typeof url === 'string') {
    return createLocaleUrl(locale, url);
  } else {
    return url.map(u => createLocaleUrl(locale, u));
  }
}

export function createLocaleUrl(locale: string, url: string) {
  let localeUrl: string = '/';

  locales.forEach(locale => {
    url = url.replace(new RegExp(`^/${locale}`), '');
  });

  if (url[0] === '/') {
    url = url.substring(1);
  }

  if (locale !== locales[0]) {
    localeUrl += locale;

    if (url.length) {
      localeUrl += '/';
    }
  }

  if (url.length) {
    localeUrl += url;
  }

  return localeUrl;
}
