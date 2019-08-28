import { useState, useEffect } from 'react';
import useRoute from 'hooks/useRoute';
import i18n, { Locale, locales } from 'stores/i18n';

// Some magic regular expression to strip away the local part of a given url path
const stripLocaleRegExp = new RegExp(`\\/(?!(${locales.join('|')})(\\/|$)).*`);
function stripLocale(path: string) {
  const pathWithoutLocale = path.match(stripLocaleRegExp);
  return (pathWithoutLocale && pathWithoutLocale[0]) || '/';
}

// Some magic regular expression to get the local part of a given url path
const getLocaleRegExp = new RegExp(`^\\/(${locales.join('|')})`);
function getLocale(path: string) {
  const locale = path.match(getLocaleRegExp);
  return (locale && (locale[1] as Locale)) || locales[0];
}

// Helper function to concatenate locale and a url path
function createUrl(locale: Locale, path: string) {
  if (!path || path[0] !== '/') {
    throw new Error(`Navigation failed, incorrect path: ${path}`);
  }

  let localeUrl: string = '/';
  path = path.substring(1);
  if (locale !== locales[0]) localeUrl += `${locale}/`;
  if (path.length) localeUrl += path;

  return localeUrl;
}

function useLocale(shouldHandleFetch: boolean = false) {
  const [i18nState, i18nActions] = i18n.useStore();
  const { location, history } = useRoute();

  const routeLocale = getLocale(location.pathname);
  const routePath = stripLocale(location.pathname);

  const [fetching, setFetching] = useState(false);

  const translations = i18nState.translations[routeLocale];
  useEffect(() => {
    if (!shouldHandleFetch || fetching) return;
    if (!translations || !Object.keys(translations).length) {
      setFetching(true);
      import(`translations/${routeLocale}.json`).then(
        ({ default: importedTranslations }) => {
          i18nActions.addTranslations({
            [routeLocale]: importedTranslations
          });
          i18nActions.setLocale(routeLocale);
          setFetching(false);
        }
      );
    }
  }, [fetching, i18nActions, routeLocale, shouldHandleFetch, translations]);

  if (
    translations &&
    Object.keys(translations).length &&
    routeLocale !== i18nState.locale
  ) {
    i18nActions.setLocale(routeLocale);
  } else if (routeLocale === locales[0] && routePath !== location.pathname) {
    history.push({
      ...location,
      pathname: createUrl(routeLocale, routePath)
    });
  }

  return {
    locale: routeLocale,
    path: routePath,
    createPath: (path: string) => createUrl(routeLocale, path),
    changeLocale: (newLocale: Locale) => {
      history.push({ ...location, pathname: createUrl(newLocale, routePath) });
    },
    goto: (newPath: string) => {
      history.push({ ...location, pathname: createUrl(routeLocale, newPath) });
    }
  };
}

export default useLocale;
