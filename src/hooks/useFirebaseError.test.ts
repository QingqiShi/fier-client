import { renderHook } from 'testUtils';
import useFirebaseError from './useFirebaseError';

const mockErrorState = { isShowing: false };
const mockSetMessage = jest.fn();
jest.mock('stores/snackbar', () => ({
  __esModule: true,
  default: {
    useStore: () => [mockErrorState, { setMessage: mockSetMessage }]
  }
}));

beforeEach(() => {
  jest.clearAllMocks();
});

test('catch errors and sets message', async () => {
  const { result } = renderHook(useFirebaseError, {
    translations: true
  });

  result.current(() => Promise.reject({ code: 'test_error' }));

  await Promise.resolve();
  expect(mockSetMessage).toHaveBeenLastCalledWith({
    type: 'error',
    message: 'Encountered unknown error'
  });
});

test('catch firebase errors and sets custom message', async () => {
  const { result } = renderHook(useFirebaseError, {
    translations: true
  });

  result.current(() => Promise.reject({ code: 'auth/wrong-password' }));

  await Promise.resolve();
  expect(mockSetMessage).toHaveBeenLastCalledWith({
    type: 'error',
    message: "Oops, that's a wrong password. Try again"
  });
});

test('ignores error when error exist already', async () => {
  mockErrorState.isShowing = true;
  const { result } = renderHook(useFirebaseError);

  result.current(() => Promise.reject({ code: 'test_error' }));

  await Promise.resolve();
  expect(mockSetMessage).not.toHaveBeenCalled();
});

test('set onError callback', async () => {
  const { result } = renderHook(useFirebaseError, {
    translations: true
  });

  const handleError = jest.fn();
  result.current(() => Promise.reject({ code: 'test_error' }), handleError);

  await Promise.resolve();
  expect(handleError).toHaveBeenLastCalledWith({ code: 'test_error' });
});
