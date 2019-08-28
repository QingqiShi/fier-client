import React from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Dialog, DialogContent, IconButton, Slide } from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close } from '@material-ui/icons';
import TitleBar from 'components/base/TitleBar';

const useStyles = makeStyles(
  createStyles({
    content: {
      paddingTop: 72
    }
  })
);

const Transition = React.forwardRef<any, TransitionProps>((props: any, ref) => {
  return <Slide direction="up" ref={ref} {...props} />;
});

function SlideModal({
  open,
  onClose,
  title,
  children
}: React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
}>) {
  const classes = useStyles();
  return (
    <Dialog
      fullScreen
      open={open}
      onClose={onClose}
      TransitionComponent={Transition}
    >
      <DialogContent>
        <TitleBar
          color="paper"
          title={title}
          rightAction={
            <IconButton
              onClick={onClose}
              edge="end"
              color="inherit"
              aria-label="close"
            >
              <Close />
            </IconButton>
          }
        />
        <div className={classes.content}>{children}</div>
      </DialogContent>
    </Dialog>
  );
}

export default SlideModal;
