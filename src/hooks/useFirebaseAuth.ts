import { auth } from 'firebase/app';
import user from 'stores/user';
import useFirebaseError from 'hooks/useFirebaseError';

function useFirebaseAuth() {
  const [userState, userActions] = user.useStore();

  const handleError = useFirebaseError();

  function signUp({
    email,
    password,
    name
  }: {
    email: string;
    password: string;
    name: string;
  }) {
    return handleError(async () => {
      const userCred = await auth().createUserWithEmailAndPassword(
        email,
        password
      );

      if (userCred.user) {
        await userCred.user.updateProfile({
          displayName: name
        });
        userActions.updateUser(name);
      }

      return userCred;
    });
  }

  function signIn({ email, password }: { email: string; password: string }) {
    return handleError(() =>
      auth().signInWithEmailAndPassword(email, password)
    );
  }

  function signOut() {
    return handleError(() => auth().signOut());
  }

  function updateName(name: string) {
    const user = auth().currentUser;
    if (!user) return;

    return handleError(async () => {
      userActions.updateUser(name);
      await user.updateProfile({ displayName: name });
    }).catch(() => {
      if (user.displayName) {
        userActions.updateUser(user.displayName);
      }
    });
  }

  function updateEmail(email: string, currentPassword: string) {
    return handleError(async () => {
      const user = auth().currentUser;
      if (!user || !user.email) return;

      const cred = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(cred);
      await user.updateEmail(email);
    });
  }

  function updatePassword(password: string, currentPassword: string) {
    return handleError(async () => {
      const user = auth().currentUser;
      if (!user || !user.email) return;

      const cred = auth.EmailAuthProvider.credential(
        user.email,
        currentPassword
      );
      await user.reauthenticateWithCredential(cred);
      await user.updatePassword(password);
    });
  }

  return {
    user: userState,
    signIn,
    signUp,
    signOut,
    updateName,
    updateEmail,
    updatePassword
  };
}

export default useFirebaseAuth;
