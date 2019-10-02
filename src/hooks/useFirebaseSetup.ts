import { useEffect, useState } from 'react';
import { auth } from 'firebase/app';
import user from 'stores/user';
import settings from 'stores/settings';

function useFirebaseSetup() {
  const [, userActions] = user.useStore();
  const [{ locale }] = settings.useStore();
  const [ready, setReady] = useState(false);

  /*
    Listen for auth state changes
  */
  useEffect(() => {
    return auth().onAuthStateChanged(user => {
      if (user && user.email) {
        userActions.setUser({
          uid: user.uid,
          email: user.email,
          name: user.displayName || user.email.split('@')[0],
          emailVerified: user.emailVerified
        });
      } else {
        userActions.signOut();
      }

      setReady(true);
    });
  }, [userActions]);

  /*
    Set firebase language (for email)
  */
  useEffect(() => {
    auth().languageCode = locale;
  }, [locale]);

  return ready;
}

export default useFirebaseSetup;
