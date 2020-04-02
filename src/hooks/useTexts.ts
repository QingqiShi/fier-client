import { useEffect, useState } from 'react';
import settings from 'stores/settings';
import i18n from 'stores/i18n';
import type { TranslationKey } from 'translations/translationKeys';

type Texts = {
  [key in TranslationKey]: string;
};
type InjectParam = (text: string, params: { [key: string]: string }) => string;

function getProxy(texts: Partial<Texts>) {
  return new Proxy(texts, {
    get(target, name) {
      if (typeof name === 'string' && !target[name as TranslationKey]) {
        return `?${name}?`;
      }
      return Reflect.get(target, name);
    },
  }) as Texts;
}

function useTexts(): [Texts, InjectParam] {
  const [{ locale }] = settings.useStore();
  const [{ translations }] = i18n.useStore();
  const texts = translations[locale] || {};
  const [proxy, setProxy] = useState<Texts>(getProxy(texts));

  useEffect(() => {
    setProxy(getProxy(texts));
  }, [texts]);

  const param = (text: string, params: { [key: string]: string }) => {
    Object.keys(params).forEach((key) => {
      text = text.replace(`{{${key}}}`, params[key]);
    });
    return text;
  };

  return [proxy, param];
}

export default useTexts;
