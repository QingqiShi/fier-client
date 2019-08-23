import React from 'react';
import { makeStyles, Theme } from '@material-ui/core/styles';
import Container, { ContainerProps } from '@material-ui/core/Container';
import Paper from '@material-ui/core/Paper';

const useStyles = makeStyles((theme: Theme) => ({
  overlay: {
    position: 'fixed',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    overflow: 'auto',
    display: 'flex',
    alignItems: 'center',
    zIndex: theme.zIndex.modal
  }
}));

function OverlayContainer({
  children,
  ...props
}: React.PropsWithChildren<ContainerProps>) {
  const classes = useStyles();
  return (
    <Paper className={classes.overlay}>
      <Container {...props}>{children}</Container>
    </Paper>
  );
}

export default OverlayContainer;
