import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Button, LinearProgress } from '@material-ui/core';

const useStyles = makeStyles(
  createStyles({
    progress: {
      position: 'absolute',
      left: 0,
      right: 0,
      bottom: 0
    }
  })
);

function ProgressButton({
  children,
  loading,
  disabled,
  ...props
}: { loading: boolean } & Parameters<typeof Button>[0]) {
  const classes = useStyles();
  return (
    <Button {...props} disabled={loading || disabled}>
      {children}
      {loading && <LinearProgress className={classes.progress} />}
    </Button>
  );
}

export default ProgressButton;
