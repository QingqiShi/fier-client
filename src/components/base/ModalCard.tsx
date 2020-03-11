import React, { forwardRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';

interface StyleProps {
  height?: number;
}
const useStyles = makeStyles(() =>
  createStyles({
    modalPaper: {
      outline: 0,
      position: 'fixed',
      top: ({ height }: StyleProps) =>
        height ? `calc(100% - ${height}px)` : 0,
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
  height?: number;
}>;

const ModalCard = forwardRef<HTMLDivElement, ModalCardProps>(
  ({ children, style, height }, ref) => {
    const classes = useStyles({ height });

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
