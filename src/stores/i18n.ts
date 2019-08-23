import { createStore } from 'libs/lit-store';

export type Locale = 'en' | 'zh';
export const locales = ['en', 'zh'] as const;

export type Translations = {
  [lang in Locale]?: {
    [key: string]: string;
  };
};

export type State = {
  locale: Locale;
  translations: Translations;
};

// type Action =
//   | { type: 'ADD_TRANSLATIONS'; payload: State['translations'] }
//   | { type: 'SET_LOCALE'; payload: Locale };

const mutations = {
  addTranslations: (prevState: State, translations: Translations) => {
    const result = { translations: { ...prevState.translations } };
    const locales = Object.keys(translations) as Locale[];
    locales.forEach(locale => {
      result.translations[locale] = {
        ...result.translations[locale],
        ...translations[locale]
      };
    });
    return result;
  },
  setLocale: (prevState: State, locale: Locale) => {
    if (!prevState.translations[locale]) {
      prevState.translations[locale] = {};
      return { locale, translations: prevState.translations };
    }
    return { locale };
  }
};

const store = createStore<State, typeof mutations>(
  { locale: 'en', translations: { en: {} } },
  mutations
);

export default store;
