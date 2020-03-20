import React, { useCallback } from 'react';
import { Button, Slide, Snackbar } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import { TransitionProps } from '@material-ui/core/transitions/transition';
import snackbar from 'stores/snackbar';

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}

function SnackbarMessage() {
  const [
    { type, message, actionLabel, action, isShowing, hideAfter },
    { clearMessage }
  ] = snackbar.useStore();

  const handleSnackbarClose = useCallback(
    (e: React.SyntheticEvent<any, Event>, reason?: string) => {
      if (reason === 'clickaway') return;
      clearMessage();
    },
    [clearMessage]
  );

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      autoHideDuration={hideAfter || undefined}
      open={isShowing}
      TransitionComponent={SlideTransition}
      onClose={handleSnackbarClose}
    >
      <Alert
        action={
          action &&
          actionLabel && <Button onClick={action}>{actionLabel}</Button>
        }
        elevation={6}
        severity={type}
        variant="filled"
        onClose={clearMessage}
      >
        {message}
      </Alert>
    </Snackbar>
  );
}

export default SnackbarMessage;
