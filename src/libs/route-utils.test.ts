import { createUrl, getLocale, stripLocale } from './route-utils';

test.each`
  path          | expected
  ${'/'}        | ${'/'}
  ${'/en'}      | ${'/'}
  ${'/zh'}      | ${'/'}
  ${'/test'}    | ${'/test'}
  ${'/en/test'} | ${'/test'}
  ${'/zh/test'} | ${'/test'}
  ${''}         | ${'/'}
`('stripLocale $path', ({ path, expected }) => {
  expect(stripLocale(path)).toEqual(expected);
});

test.each`
  path          | expected
  ${'/'}        | ${'en'}
  ${'/en'}      | ${'en'}
  ${'/zh'}      | ${'zh'}
  ${'/test'}    | ${'en'}
  ${'/en/test'} | ${'en'}
  ${'/zh/test'} | ${'zh'}
  ${''}         | ${'en'}
`('getLocale $path', ({ path, expected }) => {
  expect(getLocale(path)).toEqual(expected);
});

test.each`
  locale  | path       | expected
  ${'en'} | ${'/'}     | ${'/'}
  ${'zh'} | ${'/'}     | ${'/zh/'}
  ${'en'} | ${'/test'} | ${'/test'}
  ${'zh'} | ${'/test'} | ${'/zh/test'}
`('createUrl $locale, $path', ({ locale, path, expected }) => {
  expect(createUrl(locale, path)).toEqual(expected);
});

test('createUrl throw when no path provided', () => {
  expect(() => createUrl('en', '')).toThrow();
});
