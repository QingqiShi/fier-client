import { useContext } from 'react';
import { RouteContext } from 'libs/route-provider';
import { Locale, locales } from 'stores/i18n';

// Some magic regular expression to strip away the local part of a given url path
const stripLocaleRegExp = new RegExp(`\\/(?!(${locales.join('|')})(\\/|$)).*`);
export function stripLocale(path: string) {
  const pathWithoutLocale = path.match(stripLocaleRegExp);
  return (pathWithoutLocale && pathWithoutLocale[0]) || '/';
}

// Some magic regular expression to get the local part of a given url path
const getLocaleRegExp = new RegExp(`^\\/(${locales.join('|')})`);
export function getLocale(path: string) {
  const locale = path.match(getLocaleRegExp);
  return (locale && (locale[1] as Locale)) || locales[0];
}

// Helper function to concatenate locale and a url path
export function createUrl(locale: Locale, path: string) {
  if (!path || path[0] !== '/') {
    throw new Error(`Navigation failed, incorrect path: ${path}`);
  }

  let localeUrl: string = '/';
  path = path.substring(1);
  if (locale !== locales[0]) localeUrl += `${locale}/`;
  if (path.length) localeUrl += path;

  return localeUrl;
}

function useRoute() {
  return useContext(RouteContext);
}

export default useRoute;
