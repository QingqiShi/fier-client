import { renderHook } from 'testUtils';
import useFirebaseError from './useFirebaseError';

const mockErrorState = { hasError: false };
const mockSetError = jest.fn();
jest.mock('stores/error', () => ({
  __esModule: true,
  default: {
    useStore: () => [mockErrorState, { setError: mockSetError }]
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('catch errors and sets message', async () => {
  const { result } = renderHook(useFirebaseError, [], {
    translations: true
  });

  result.current(() => Promise.reject({ code: 'test_error' }));

  await Promise.resolve();
  expect(mockSetError).toHaveBeenLastCalledWith('Encountered unknown error');
});

test('catch firebase errors and sets custom message', async () => {
  const { result } = renderHook(useFirebaseError, [], {
    translations: true
  });

  result.current(() => Promise.reject({ code: 'auth/wrong-password' }));

  await Promise.resolve();
  expect(mockSetError).toHaveBeenLastCalledWith(
    "Oops, that's a wrong password. Try again"
  );
});

test('ignores error when error exist already', async () => {
  mockErrorState.hasError = true;
  const { result } = renderHook(useFirebaseError);

  result.current(() => Promise.reject({ code: 'test_error' }));

  await Promise.resolve();
  expect(mockSetError).not.toHaveBeenCalled();
});
