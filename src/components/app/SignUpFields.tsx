import React, { useState } from 'react';
import { makeStyles, createStyles, Theme } from '@material-ui/core/styles';
import { TextField, InputAdornment, IconButton } from '@material-ui/core';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import ProgressButton from 'components/base/ProgressButton';
import EndOfFormLink from 'components/base/EndOfFormLink';
import useTexts from 'hooks/useTexts';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    button: {
      marginTop: theme.spacing(5)
    }
  })
);

function SignUpFields({
  emailControl,
  passwordControl,
  nameControl,
  loading
}: {
  emailControl: [string, React.FormEventHandler];
  passwordControl: [string, React.FormEventHandler];
  nameControl: [string, React.FormEventHandler];
  loading: boolean;
}) {
  const [t] = useTexts();
  const classes = useStyles();

  const [email, handleEmailChange] = emailControl;
  const [password, handlePasswordChange] = passwordControl;
  const [name, handleNameChange] = nameControl;

  const [showPassword, setShowPassword] = useState(false);

  return (
    <>
      <TextField
        label={t['DISPLAY_NAME_LABEL']}
        value={name}
        onChange={handleNameChange}
        type="text"
        name="name"
        autoComplete="name"
        margin="normal"
        fullWidth
        required
      />
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
        type={showPassword ? 'text' : 'password'}
        autoComplete="new-password"
        margin="normal"
        fullWidth
        required
        InputProps={{
          endAdornment: (
            <InputAdornment position="end">
              <IconButton
                aria-label="toggle password visibility"
                onClick={() => setShowPassword(val => !val)}
              >
                {showPassword ? <Visibility /> : <VisibilityOff />}
              </IconButton>
            </InputAdornment>
          )
        }}
      />
      <ProgressButton
        loading={loading}
        className={classes.button}
        variant="contained"
        color="primary"
        type="submit"
        size="large"
        fullWidth
      >
        {t['REGISTER']}
      </ProgressButton>
      <EndOfFormLink to="/login">
        {t['ALREADY_REGISTERED_PROMPT']}
      </EndOfFormLink>
    </>
  );
}

export default SignUpFields;
