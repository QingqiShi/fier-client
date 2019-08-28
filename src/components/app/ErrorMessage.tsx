import React from 'react';
import { makeStyles, Theme, createStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Slide,
  Snackbar,
  SnackbarContent
} from '@material-ui/core';
import { Error as ErrorIcon, Close as CloseIcon } from '@material-ui/icons';
import error from 'stores/error';
import { TransitionProps } from '@material-ui/core/transitions/transition';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    error: {
      backgroundColor: theme.palette.error.dark
    },
    messageWrapper: {
      display: 'flex',
      alignItems: 'center'
    },
    message: {
      marginLeft: theme.spacing(1)
    }
  })
);

function SlideTransition(props: TransitionProps) {
  return <Slide {...props} direction="down" />;
}

function ErrorMessage() {
  const classes = useStyles();
  const [errorState, errorActions] = error.useStore();

  function close() {
    errorActions.clearError();
  }

  function handleClose(e: React.SyntheticEvent<any, Event>, reason?: string) {
    if (reason === 'clickaway') {
      return;
    }
    close();
  }

  return (
    <Snackbar
      anchorOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
      open={errorState.hasError}
      onClose={handleClose}
      autoHideDuration={6000}
      TransitionComponent={SlideTransition}
    >
      <SnackbarContent
        className={classes.error}
        message={
          <span id="client-snackbar" className={classes.messageWrapper}>
            <ErrorIcon />
            <span className={classes.message}>{errorState.errorMessage}</span>
          </span>
        }
        action={
          <IconButton
            key="close"
            aria-label="close"
            color="inherit"
            onClick={close}
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </Snackbar>
  );
}

export default ErrorMessage;
