import React, { forwardRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

const useStyles = makeStyles(() =>
  createStyles({
    modalPaper: {
      outline: 0,
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      overflow: 'hidden',
      willChange: 'transform'
    }
  })
);

type ModalCardProps = React.PropsWithChildren<{
  style?: any;
}>;

const ModalCard = forwardRef<HTMLDivElement, ModalCardProps>(
  ({ children, style }, ref) => {
    const classes = useStyles();

    return (
      <Paper
        ref={ref}
        className={classes.modalPaper}
        style={style}
        tabIndex={1}
      >
        {children}
      </Paper>
    );
  }
);

export default ModalCard;
