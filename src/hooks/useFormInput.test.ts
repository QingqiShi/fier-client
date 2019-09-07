import { act, renderHook } from '@testing-library/react-hooks';
import useFormInput from './useFormInput';

describe('useFormInput', () => {
  it('sets initial value', () => {
    const { result } = renderHook(() => useFormInput('test'));
    expect(result.current[0]).toEqual('test');
  });

  it('defaults to empty value', () => {
    const { result } = renderHook(() => useFormInput());
    expect(result.current[0]).toEqual('');
  });

  it('returns change handler', () => {
    const { result } = renderHook(() => useFormInput());
    const handler = result.current[1];

    act(() => {
      handler({ currentTarget: { value: 'test' } } as any);
    });

    expect(result.current[0]).toEqual('test');
  });
});
