import { act } from '@testing-library/react-hooks';
import { renderHook } from 'testUtils';
import error from './error';

describe('error', () => {
  it('setError', () => {
    const { result } = renderHook(() => error.useStore(), { stores: [error] });
    expect(result.current[0].hasError).toBe(false);
    act(() => {
      result.current[1].setError('test');
    });
    expect(result.current[0].hasError).toBe(true);
    expect(result.current[0].errorMessage).toEqual('test');
  });

  it('clearError', () => {
    const { result } = renderHook(() => error.useStore(), { stores: [error] });
    act(() => {
      result.current[1].setError('test');
    });
    act(() => {
      result.current[1].clearError();
    });
    expect(result.current[0].hasError).toBe(false);
  });
});
