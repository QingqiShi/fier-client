import { renderHook } from 'testUtils';
import { useHistory } from 'react-router';
import { act } from '@testing-library/react-hooks';
import useModalHash, { Modal } from './useModalHash';

test('open and close using Hash string', () => {
  const historyRef: { history: any } = { history: null };

  const { result } = renderHook(() => useModalHash(Modal.PROFILE), [], {
    url: '/zh/test?test=bob#foo',
    useHook: () => {
      historyRef.history = useHistory();
    }
  });

  expect(result.current.isOpen).toBe(false);

  act(() => result.current.open());
  expect(historyRef.history.location.hash).toEqual(Modal.PROFILE);
  expect(result.current.isOpen).toBe(true);

  act(() => result.current.close());
  expect(historyRef.history.location.hash).toEqual('');
  expect(result.current.isOpen).toBe(false);
});
