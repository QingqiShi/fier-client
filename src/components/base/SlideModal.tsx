import React, { useState } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import {
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Slide
} from '@material-ui/core';
import { TransitionProps } from '@material-ui/core/transitions';
import { Close } from '@material-ui/icons';
import TitleBar from 'components/base/TitleBar';

const useStyles = makeStyles(
  createStyles({
    header: {
      height: 72
    }
  })
);

const Transition = React.forwardRef<any, TransitionProps>((props: any, ref) => {
  return <Slide ref={ref} direction="up" {...props} />;
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
  const [dialogRef, setDialogRef] = useState<Node | null>(null);
  return (
    <Dialog
      open={open}
      scroll="paper"
      TransitionComponent={Transition}
      fullScreen
      onClose={onClose}
    >
      <DialogTitle className={classes.header}>
        <TitleBar
          color="paper"
          rightAction={
            <IconButton
              aria-label="close"
              color="inherit"
              edge="end"
              onClick={onClose}
            >
              <Close />
            </IconButton>
          }
          scrollTarget={dialogRef}
          title={title}
        />
      </DialogTitle>
      <DialogContent ref={el => setDialogRef(el as Node)}>
        {children}
      </DialogContent>
    </Dialog>
  );
}

export default SlideModal;
