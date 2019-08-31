import React, { useState } from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import { IconButton, InputAdornment, TextField } from '@material-ui/core';
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
        autoComplete="name"
        label={t['DISPLAY_NAME_LABEL']}
        margin="normal"
        name="name"
        type="text"
        value={name}
        fullWidth
        required
        onChange={handleNameChange}
      />
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
        label={t['PASSWORD_LABEL']}
        margin="normal"
        type={showPassword ? 'text' : 'password'}
        value={password}
        fullWidth
        required
        onChange={handlePasswordChange}
      />
      <ProgressButton
        className={classes.button}
        color="primary"
        loading={loading}
        size="large"
        type="submit"
        variant="contained"
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
