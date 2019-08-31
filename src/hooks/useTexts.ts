import { useState, useEffect } from 'react';
import i18n from 'stores/i18n';

type Texts = {
  [key: string]: string;
};
type InjectParam = (text: string, params: { [key: string]: string }) => string;

function getProxy(texts?: Texts) {
  return new Proxy(texts || {}, {
    get(target, name) {
      if (typeof name === 'string' && !target[name]) {
        return `?${name}?`;
      }
      return Reflect.get(target, name);
    }
  });
}

function useTexts(): [Texts, InjectParam] {
  const [state] = i18n.useStore();
  const texts = state.translations[state.locale];
  const [proxy, setProxy] = useState<{
    [key: string]: string;
  }>(getProxy(texts));

  useEffect(() => {
    setProxy(getProxy(texts));
  }, [texts]);

  const param = (text: string, params: { [key: string]: string }) => {
    Object.keys(params).forEach(key => {
      text = text.replace(`{{${key}}}`, params[key]);
    });
    return text;
  };

  return [proxy, param];
}

export default useTexts;
