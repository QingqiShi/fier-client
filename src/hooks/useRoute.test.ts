import { renderHook } from 'testUtils';
import { useHistory } from 'react-router';
import { act } from '@testing-library/react-hooks';
import useRoute from './useRoute';

test.each`
  url           | expected
  ${'/zh/test'} | ${'zh'}
  ${'/test'}    | ${'en'}
`('routeLocale for url $url', ({ url, expected }) => {
  const { result } = renderHook(() => useRoute(), { url });
  expect(result.current.routeLocale).toEqual(expected);
});

test.each`
  url           | expected
  ${'/zh/test'} | ${'/test'}
  ${'/test'}    | ${'/test'}
`('routePath for url $url', ({ url, expected }) => {
  const { result } = renderHook(() => useRoute(), { url });
  expect(result.current.routePath).toEqual(expected);
});

test.each`
  url                | expected
  ${'/zh/test#test'} | ${'#test'}
  ${'/test?test'}    | ${''}
`('routeHash for url $url', ({ url, expected }) => {
  const { result } = renderHook(() => useRoute(), { url });
  expect(result.current.routeHash).toEqual(expected);
});

test.each`
  url           | path      | expected
  ${'/test'}    | ${'/abc'} | ${'/abc'}
  ${'/zh/test'} | ${'/abc'} | ${'/zh/abc'}
`('getPath $path with $url', ({ url, path, expected }) => {
  const { result } = renderHook(() => useRoute(), { url });
  expect(result.current.getPath(path)).toEqual(expected);
});

test('redirect', () => {
  const historyObj: { history: import('history').History | null } = {
    history: null
  };
  const { result } = renderHook(() => useRoute(), {
    useHook: () => {
      historyObj.history = useHistory();
    }
  });
  act(() => result.current.redirect('/abc'));
  expect(historyObj.history && historyObj.history.location.pathname).toEqual(
    '/abc'
  );
});
