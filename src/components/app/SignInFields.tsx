import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core';
import ProgressButton from 'components/base/ProgressButton';
import EndOfFormLink from 'components/base/EndOfFormLink';
import useTexts from 'hooks/useTexts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    loginButton: {
      marginTop: theme.spacing(5)
    }
  })
);

function SignUpFields({
  emailControl,
  passwordControl,
  loading
}: {
  emailControl: [string, React.FormEventHandler];
  passwordControl: [string, React.FormEventHandler];
  loading: boolean;
}) {
  const [t] = useTexts();
  const classes = useStyles();

  const [email, handleEmailChange] = emailControl;
  const [password, handlePasswordChange] = passwordControl;

  return (
    <>
      <TextField
        autoComplete="email"
        label={t['EMAIL_LABEL']}
        margin="normal"
        name="email"
        type="email"
        value={email}
        fullWidth
        required
        onChange={handleEmailChange}
      />
      <TextField
        autoComplete="new-password"
        label={t['PASSWORD_LABEL']}
        margin="normal"
        type="password"
        value={password}
        fullWidth
        required
        onChange={handlePasswordChange}
      />
      <ProgressButton
        className={classes.loginButton}
        color="primary"
        loading={loading}
        size="large"
        type="submit"
        variant="contained"
        fullWidth
      >
        {t['LOGIN']}
      </ProgressButton>
      <EndOfFormLink to="/register">{t['NO_ACCOUNT_PROMPT']}</EndOfFormLink>
    </>
  );
}

export default SignUpFields;
