import { useEffect } from 'react';
import { auth } from 'firebase/app';
import user from 'stores/user';
import i18n from 'stores/i18n';

function useFirebaseSetup() {
  const [userState, userActions] = user.useStore();
  useEffect(() => {
    const unsubscribe = auth().onAuthStateChanged(user => {
      if (user && user.email) {
        userActions.setUser({
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          emailVerified: user.emailVerified
        });
      } else {
        userActions.signOut();
      }
      userActions.setInitialState();
    });

    return unsubscribe;
  }, [userActions]);

  const [{ locale }] = i18n.useStore();
  useEffect(() => {
    auth().languageCode = locale;
  }, [locale]);

  return userState;
}

export default useFirebaseSetup;
