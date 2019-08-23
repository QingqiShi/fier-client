import React from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import TextField from '@material-ui/core/TextField';
import ProgressButton from 'components/ProgressButton';
import EndOfFormLink from 'components/EndOfFormLink';
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
        label={t['EMAIL_LABEL']}
        value={email}
        onChange={handleEmailChange}
        type="email"
        name="email"
        autoComplete="email"
        margin="normal"
        fullWidth
        required
      />
      <TextField
        label={t['PASSWORD_LABEL']}
        value={password}
        onChange={handlePasswordChange}
        type="password"
        autoComplete="new-password"
        margin="normal"
        fullWidth
        required
      />
      <ProgressButton
        loading={loading}
        className={classes.loginButton}
        type="submit"
        variant="contained"
        color="primary"
        size="large"
        fullWidth
      >
        {t['LOGIN']}
      </ProgressButton>
      <EndOfFormLink to="/register">{t['NO_ACCOUNT_PROMPT']}</EndOfFormLink>
    </>
  );
}

export default SignUpFields;
