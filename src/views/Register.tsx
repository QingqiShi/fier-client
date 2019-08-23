import React, { useState } from 'react';
import Typography from '@material-ui/core/Typography';
import { LocaleRedirect } from 'libs/locale-router';
import OverlayContainer from 'components/OverlayContainer';
import SignUpFields from 'components/SignUpFields';
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
    return <LocaleRedirect to="/dashboard" />;
  }

  return (
    <OverlayContainer maxWidth="xs">
      <Typography variant="h3" component="h1" gutterBottom>
        {t['REGISTER']}
      </Typography>
      <form onSubmit={handleSubmit}>
        <SignUpFields
          emailControl={emailControl}
          passwordControl={passwordControl}
          nameControl={nameControl}
          loading={loading}
        />
      </form>
    </OverlayContainer>
  );
}

export default Login;
