import { useEffect } from 'react';
import i18n from 'stores/i18n';
import useRoute from 'hooks/useRoute';

function TranslationLoader() {
  const [{ translations }, { addTranslations }] = i18n.useStore();
  const { routeLocale } = useRoute();

  const currentTranslations = translations[routeLocale];
  useEffect(() => {
    if (!currentTranslations || !Object.keys(currentTranslations).length) {
      import(`translations/${routeLocale}.json`).then(
        ({ default: importedTranslations }) => {
          addTranslations({ [routeLocale]: importedTranslations });
        }
      );
    }
  }, [addTranslations, currentTranslations, routeLocale]);

  return null;
}

export default TranslationLoader;
