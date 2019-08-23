import React from 'react';
import { createStyles, makeStyles, Theme } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import LinearProgress from '@material-ui/core/LinearProgress';

const useStyles = makeStyles((theme: Theme) =>
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
  ...props
}: { loading: boolean } & Parameters<typeof Button>[0]) {
  const classes = useStyles();
  return (
    <Button {...props} disabled={loading}>
      {children}
      {loading && <LinearProgress className={classes.progress} />}
    </Button>
  );
}

export default ProgressButton;
