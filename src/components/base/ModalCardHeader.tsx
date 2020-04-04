import React, { forwardRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ReactEventHandlers } from 'react-use-gesture/dist/types';

interface StyleProps {
  dragging?: boolean;
  hideHandle?: boolean;
}
const useStyles = makeStyles((theme) =>
  createStyles({
    headerRoot: {
      height: theme.spacing(6),
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: theme.zIndex.snackbar,
      cursor: ({ dragging }: StyleProps) => (dragging ? 'grabbing' : 'grab'),
      pointerEvents: ({ hideHandle }: StyleProps) =>
        hideHandle ? 'none' : undefined,
    },
    handle: {
      height: 3,
      borderRadius: 2,
      width: theme.spacing(4),
      backgroundColor: theme.palette.text.secondary,
      margin: `6px auto 0`,
    },
  })
);

type ModalCardHeaderProps = React.PropsWithChildren<{
  eventHandlers?: ReactEventHandlers;
  hideHandle?: boolean;
  dragging?: boolean;
}>;

const ModalCardHeader = forwardRef<HTMLDivElement, ModalCardHeaderProps>(
  ({ children, eventHandlers, hideHandle, dragging }, ref) => {
    const classes = useStyles({ dragging, hideHandle });

    return (
      <div ref={ref} className={classes.headerRoot} {...eventHandlers}>
        {!hideHandle && (
          <div className={classes.handle} data-testid="modal-card-handle" />
        )}
        {children}
      </div>
    );
  }
);

export default ModalCardHeader;
