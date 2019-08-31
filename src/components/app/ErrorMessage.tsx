import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core/styles';
import {
  IconButton,
  Slide,
  Snackbar,
  SnackbarContent
} from '@material-ui/core';
import { Close as CloseIcon, Error as ErrorIcon } from '@material-ui/icons';
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
      autoHideDuration={6000}
      open={errorState.hasError}
      TransitionComponent={SlideTransition}
      onClose={handleClose}
    >
      <SnackbarContent
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
        className={classes.error}
        message={
          <span className={classes.messageWrapper} id="client-snackbar">
            <ErrorIcon />
            <span className={classes.message}>{errorState.errorMessage}</span>
          </span>
        }
      />
    </Snackbar>
  );
}

export default ErrorMessage;
