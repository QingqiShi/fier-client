import { renderHook } from 'testUtils';
import useTexts from './useTexts';

jest.mock('translations/en.json', () => ({
  GREETING: 'Hello world',
  AUTHER: 'Written by {{firstName}} {{lastName}}'
}));

describe('useText', () => {
  it('returns text from store', () => {
    const { result } = renderHook(() => useTexts());
    const [texts] = result.current;
    expect(texts['GREETING']).toEqual('Hello world');
  });

  it('interpolates parameterised texts', () => {
    const { result } = renderHook(() => useTexts());
    const [texts, inject] = result.current;
    expect(
      inject(texts['AUTHER'], { firstName: 'Qingqi', lastName: 'Shi' })
    ).toEqual('Written by Qingqi Shi');
  });
});
