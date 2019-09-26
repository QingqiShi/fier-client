import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import OverlayContainer from 'components/base/OverlayContainer';
import SignInFields from 'components/app/SignInFields';
import LanguageSelector from 'components/app/LanguageSelector';
import useTexts from 'hooks/useTexts';
import useFormInput from 'hooks/useFormInput';
import useFirebaseAuth from 'hooks/useFirebaseAuth';

function Login() {
  const [t] = useTexts();

  const { user, signIn } = useFirebaseAuth();
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
    return <Redirect to="/dashboard" />;
  }

  return (
    <OverlayContainer maxWidth="xs">
      <Typography component="h1" variant="h3" gutterBottom>
        {t['LOGIN']}
      </Typography>
      <form autoComplete="on" onSubmit={handleSubmit}>
        <SignInFields
          emailControl={emailControl}
          loading={loading}
          passwordControl={passwordControl}
        />
      </form>
      <LanguageSelector position="fixed" />
    </OverlayContainer>
  );
}

export default Login;
