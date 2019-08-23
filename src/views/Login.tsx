import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { LocaleRedirect } from 'libs/locale-router';
import SignInFields from 'components/SignInFields';
import OverlayContainer from 'components/OverlayContainer';
import useTexts from 'hooks/useTexts';
import useFormInput from 'hooks/useFormInput';
import useAuth from 'hooks/useAuth';

function Login() {
  const [t] = useTexts();

  const { user, signIn } = useAuth();
  const [loading, setLoading] = useState(false);

  const emailControl = useFormInput('');
  const passwordControl = useFormInput('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    const email = emailControl[0];
    const password = passwordControl[0];
    signIn({ email, password }).then(user => {
      if (!user) {
        setLoading(false);
      }
    });

    return false;
  }

  if (user.isLoggedIn) {
    return <LocaleRedirect to="/dashboard" />;
  }

  return (
    <OverlayContainer maxWidth="xs">
      <Typography variant="h3" component="h1" gutterBottom>
        {t['LOGIN']}
      </Typography>
      <form autoComplete="on" onSubmit={handleSubmit}>
        <SignInFields
          emailControl={emailControl}
          passwordControl={passwordControl}
          loading={loading}
        />
      </form>
    </OverlayContainer>
  );
}

export default Login;
