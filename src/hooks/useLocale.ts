import { useCallback, useEffect, useState } from 'react';
import useRoute, { createUrl, getLocale, stripLocale } from 'hooks/useRoute';
import i18n, { Locale } from 'stores/i18n';
import settings from 'stores/settings';

function useLocale(shouldHandleFetch: boolean = false) {
  const [{ locale }] = settings.useStore();
  const [{ translations }, { addTranslations }] = i18n.useStore();
  const { location, history } = useRoute();

  const routeLocale = getLocale(location.pathname);
  const routePath = stripLocale(location.pathname);

  const [fetching, setFetching] = useState(false);

  const currentTranslations = translations[locale];
  useEffect(() => {
    if (!shouldHandleFetch || fetching) return;
    if (!currentTranslations || !Object.keys(currentTranslations).length) {
      setFetching(true);
      import(`translations/${locale}.json`).then(
        ({ default: importedTranslations }) => {
          addTranslations({ [locale]: importedTranslations });
          setFetching(false);
        }
      );
    }
  }, [
    addTranslations,
    currentTranslations,
    fetching,
    locale,
    shouldHandleFetch
  ]);

  if (
    currentTranslations &&
    Object.keys(currentTranslations).length &&
    routeLocale !== locale
  ) {
    history.push({
      ...location,
      pathname: createUrl(locale, routePath)
    });
  }

  return {
    locale: routeLocale,
    path: routePath,
    createPath: useCallback((path: string) => createUrl(locale, path), [
      locale
    ]),
    changeLocale: useCallback(
      (newLocale: Locale) => {
        history.push({
          ...location,
          pathname: createUrl(newLocale, routePath)
        });
      },
      [history, location, routePath]
    ),
    goto: useCallback(
      (newPath: string) => {
        history.push({
          ...location,
          pathname: createUrl(locale, newPath)
        });
      },
      [history, locale, location]
    )
  };
}

export default useLocale;
