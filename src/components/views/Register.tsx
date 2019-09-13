import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import { Typography } from '@material-ui/core';
import OverlayContainer from 'components/base/OverlayContainer';
import SignUpFields from 'components/app/SignUpFields';
import LanguageSelector from 'components/app/LanguageSelector';
import useTexts from 'hooks/useTexts';
import useFormInput from 'hooks/useFormInput';
import useAuth from 'hooks/useAuth';

function Login() {
  const [t] = useTexts();

  const { user, signUp } = useAuth();
  const [loading, setLoading] = useState(false);

  const emailControl = useFormInput('');
  const passwordControl = useFormInput('');
  const nameControl = useFormInput('');

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();

    setLoading(true);
    const email = emailControl[0];
    const password = passwordControl[0];
    const name = nameControl[0];
    signUp({ email, password, name }).then(() => {
      setLoading(false);
    });

    return false;
  }

  if (user.isLoggedIn) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <OverlayContainer maxWidth="xs">
      <Typography component="h1" variant="h3" gutterBottom>
        {t['REGISTER']}
      </Typography>
      <form onSubmit={handleSubmit}>
        <SignUpFields
          emailControl={emailControl}
          loading={loading}
          nameControl={nameControl}
          passwordControl={passwordControl}
        />
      </form>
      <LanguageSelector position="bottom" />
    </OverlayContainer>
  );
}

export default Login;
