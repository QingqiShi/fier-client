import { useCallback, useMemo } from 'react';
import { useHistory, useLocation } from 'react-router';
import { createUrl, getLocale, stripLocale } from 'libs/route-utils';
import { Locale } from 'stores/i18n';

function useRoute() {
  const location = useLocation();
  const history = useHistory();

  const routeLocale = useMemo(() => getLocale(location.pathname), [
    location.pathname,
  ]);
  const routePath = useMemo(() => stripLocale(location.pathname), [
    location.pathname,
  ]);
  const routeHash = location.hash;

  const getPath = useCallback((path: string) => createUrl(routeLocale, path), [
    routeLocale,
  ]);
  const redirect = useCallback(
    (path: string, locale: Locale = routeLocale) =>
      history.push({ ...location, pathname: createUrl(locale, path) }),
    [history, location, routeLocale]
  );
  const setHash = useCallback(
    (hash: string) => history.push({ ...location, hash }),
    [history, location]
  );

  return {
    routeLocale,
    routePath,
    routeHash,
    getPath,
    redirect,
    setHash,
  };
}

export default useRoute;
