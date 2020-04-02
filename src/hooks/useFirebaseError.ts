import snackbar from 'stores/snackbar';
import useText from 'hooks/useTexts';

const errorMap = {
  'auth/network-request-failed': 'ERROR_NETWORK_FAILED' as const,
  'auth/user-token-expired': 'ERROR_USER_EXPIRED' as const,
  'auth/invalid-email': 'ERROR_INVALID_EMAIL' as const,
  'auth/user-disabled': 'ERROR_USER_DISABLED' as const,
  'auth/user-not-found': 'ERROR_USER_NOT_FOUND' as const,
  'auth/wrong-password': 'ERROR_WRONG_PASSWORD' as const,
  'auth/email-already-in-use': 'ERROR_EMAIL_IN_USE' as const,
  'auth/weak-password': 'ERROR_WEEK_PASSWORD' as const,
};

function useFirebaseError() {
  const [t] = useText();
  const [{ isShowing }, { setMessage }] = snackbar.useStore();

  const handleError = (error: any) => {
    if (isShowing) return;

    if (error && error.code && errorMap[error.code as keyof typeof errorMap]) {
      setMessage({
        type: 'error',
        message: t[errorMap[error.code as keyof typeof errorMap]],
      });
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
