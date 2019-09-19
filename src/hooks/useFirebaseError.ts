import error from 'stores/error';
import useText from 'hooks/useTexts';

const errorMap: { [key: string]: string } = {
  'auth/network-request-failed': 'ERROR_NETWORK_FAILED',
  'auth/user-token-expired': 'ERROR_USER_EXPIRED',
  'auth/invalid-email': 'ERROR_INVALID_EMAIL',
  'auth/user-disabled': 'ERROR_USER_DISABLED',
  'auth/user-not-found': 'ERROR_USER_NOT_FOUND',
  'auth/wrong-password': 'ERROR_WRONG_PASSWORD',
  'auth/email-already-in-use': 'ERROR_EMAIL_IN_USE',
  'auth/weak-password': 'ERROR_WEEK_PASSWORD'
};

function useFirebaseError() {
  const [t] = useText();
  const [errorState, errorActions] = error.useStore();

  const handleError = (error: any) => {
    if (errorState.hasError) return;

    if (error && error.code && errorMap[error.code]) {
      errorActions.setError(t[errorMap[error.code]]);
    } else {
      errorActions.setError(t['ERROR_UNKNOWN']);
    }
  };

  return async (callback: () => Promise<any>) => {
    try {
      return await callback();
    } catch (e) {
      handleError(e);
    }
  };
}

export default useFirebaseError;
