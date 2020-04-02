import { act } from '@testing-library/react-hooks';
import { renderHook } from 'testUtils';
import snackbar from './snackbar';

test('setError', () => {
  const { result } = renderHook(() => snackbar.useStore(), {
    stores: [snackbar],
  });
  expect(result.current[0].isShowing).toBe(false);
  act(() => result.current[1].setMessage({ type: 'error', message: 'test' }));
  expect(result.current[0].isShowing).toBe(true);
  expect(result.current[0].type).toEqual('error');
  expect(result.current[0].message).toEqual('test');
});

test('clearError', () => {
  const { result } = renderHook(() => snackbar.useStore(), {
    stores: [snackbar],
  });
  act(() => result.current[1].setMessage({ type: 'error', message: 'test' }));
  act(() => result.current[1].clearMessage());
  expect(result.current[0].isShowing).toBe(false);
});

test('set actions', () => {
  const { result } = renderHook(() => snackbar.useStore(), {
    stores: [snackbar],
  });
  const mockAction = jest.fn();
  act(() =>
    result.current[1].setMessage({
      type: 'error',
      message: 'test',
      actionLabel: 'Reload',
      action: mockAction,
    })
  );
  expect(result.current[0].actionLabel).toEqual('Reload');
  result.current[0].action && result.current[0].action();
  expect(mockAction).toHaveBeenCalled();
});
