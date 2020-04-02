import { createStore } from 'react-lit-store';
import type { TranslationKey } from 'translations/translationKeys';

export type Locale = 'en' | 'zh';
export const locales = ['en', 'zh'] as const;

export type Translations = {
  [lang in Locale]?: {
    [key in TranslationKey]?: string;
  };
};

type State = {
  translations: Translations;
};
const initialState: State = { translations: { en: {} } };

const mutations = {
  addTranslations: (prevState: State, translations: Translations) => {
    const result = { translations: { ...prevState.translations } };
    const locales = Object.keys(translations) as Locale[];
    locales.forEach((locale) => {
      result.translations[locale] = {
        ...result.translations[locale],
        ...translations[locale],
      };
    });
    return result;
  },
};

const store = createStore<State, typeof mutations>(initialState, mutations);

export default store;
