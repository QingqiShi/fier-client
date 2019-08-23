import { useEffect } from 'react';
import { auth as firebaseAuth } from 'firebase/app';
import user from 'stores/user';
import i18n from 'stores/i18n';
import error from 'stores/error';
import useText from 'hooks/useTexts';

let authListening = false;

type SignUpProps = {
  email: string;
  password: string;
  name: string;
};

type SignInProps = {
  email: string;
  password: string;
};

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

function useAuth() {
  const [userState, userActions] = user.useStore();
  const [, errorActions] = error.useStore();
  const [{ locale }] = i18n.useStore();
  const [t] = useText();

  useEffect(() => {
    firebaseAuth().languageCode = locale;
  }, [locale]);

  useEffect(() => {
    // Singleton
    if (authListening) return;

    firebaseAuth().onAuthStateChanged(user => {
      if (user && user.email) {
        userActions.setUser({
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          emailVerified: user.emailVerified
        });
      } else {
        userActions.signOut();
      }
    });
    authListening = true;
  }, [userActions]);

  const handleError = (error: any) => {
    if (error && error.code && errorMap[error.code]) {
      errorActions.setError(t[errorMap[error.code]]);
    } else {
      errorActions.setError(t['ERROR_UNKNOWN']);
    }
  };

  async function signUp({ email, password, name }: SignUpProps) {
    try {
      const userCred = await firebaseAuth().createUserWithEmailAndPassword(
        email,
        password
      );

      if (userCred.user) {
        userCred.user.updateProfile({
          displayName: name
        });
        userActions.updateUser(name);
      }

      return userCred;
    } catch (error) {
      handleError(error);
    }
  }

  async function signIn({ email, password }: SignInProps) {
    try {
      const userCred = await firebaseAuth().signInWithEmailAndPassword(
        email,
        password
      );
      return userCred;
    } catch (error) {
      handleError(error);
    }
  }

  async function signOut() {
    try {
      return await firebaseAuth().signOut();
    } catch (error) {
      handleError(error);
    }
  }

  return { user: userState, signIn, signUp, signOut };
}

export default useAuth;
