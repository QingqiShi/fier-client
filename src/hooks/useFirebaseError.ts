import snackbar from 'stores/snackbar';
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
  const [{ isShowing }, { setMessage }] = snackbar.useStore();

  const handleError = (error: any) => {
    if (isShowing) return;

    if (error && error.code && errorMap[error.code]) {
      setMessage({ type: 'error', message: t[errorMap[error.code]] });
    } else {
      setMessage({ type: 'error', message: t['ERROR_UNKNOWN'] });
    }
  };

  return async (callback: () => Promise<any>, onError?: (e: any) => void) => {
    try {
      return await callback();
    } catch (e) {
      handleError(e);
      if (onError) {
        onError(e);
      }
    }
  };
}

export default useFirebaseError;
