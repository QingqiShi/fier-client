import { act } from '@testing-library/react-hooks';
import { renderHook } from 'testUtils';
import i18n from './i18n';

describe('i18n', () => {
  describe('addTranslations', () => {
    it('add new translations', () => {
      const { result } = renderHook(() => i18n.useStore(), [i18n]);
      expect(result.current[0].translations.zh).toBeUndefined();
      act(() => {
        result.current[1].addTranslations({
          zh: { TEST: 'test' }
        });
      });
      expect(result.current[0].translations.zh).toEqual({ TEST: 'test' });
    });

    it('merge with existing translations', () => {
      const { result } = renderHook(() => i18n.useStore(), [i18n]);
      act(() => {
        result.current[1].addTranslations({
          zh: { TEST: 'test' }
        });
      });
      act(() => {
        result.current[1].addTranslations({
          zh: { GREET: 'hello' }
        });
      });
      expect(result.current[0].translations.zh).toEqual({
        TEST: 'test',
        GREET: 'hello'
      });
    });
  });

  describe('setLocale', () => {
    it('change locale', () => {
      const { result } = renderHook(() => i18n.useStore(), [i18n]);
      act(() => {
        result.current[1].addTranslations({
          zh: { TEST: 'test' }
        });
      });
      act(() => {
        result.current[1].setLocale('zh');
      });
      expect(result.current[0].locale).toEqual('zh');
    });

    it('set empty translation if not exist', () => {
      const { result } = renderHook(() => i18n.useStore(), [i18n]);
      act(() => {
        result.current[1].setLocale('zh');
      });
      expect(result.current[0].translations.zh).toEqual({});
    });
  });
});
