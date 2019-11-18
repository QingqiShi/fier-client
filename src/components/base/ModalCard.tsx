import React, { forwardRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { Paper } from '@material-ui/core';
import { ReactEventHandlers } from 'react-use-gesture/dist/types';

const useStyles = makeStyles(theme =>
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
    },
    modalHeader: {
      height: theme.spacing(6),
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      zIndex: theme.zIndex.snackbar
    },
    modalContent: {
      padding: `calc(${theme.spacing(8)}px) calc(${theme.spacing(
        3
      )}px + env(safe-area-inset-right)) calc(env(safe-area-inset-bottom) + 5vh + ${theme.spacing(
        3
      )}px) calc(${theme.spacing(3)}px + env(safe-area-inset-left))`,
      height: '100%',
      overflowY: 'scroll'
    },
    handle: {
      height: 3,
      borderRadius: 2,
      width: theme.spacing(4),
      backgroundColor: theme.palette.text.secondary,
      margin: `6px auto 0`
    }
  })
);

type ModalCardProps = React.PropsWithChildren<{
  contentRef?: React.Ref<HTMLDivElement>;
  style?: any;
  contentProps?: ReactEventHandlers;
  headerProps?: ReactEventHandlers;
}>;

const ModalCard = forwardRef<HTMLDivElement, ModalCardProps>(
  ({ children, contentRef, style, contentProps, headerProps }, ref) => {
    const classes = useStyles();

    return (
      <Paper
        ref={ref}
        className={classes.modalPaper}
        style={style}
        tabIndex={1}
      >
        <div className={classes.modalHeader} {...headerProps}>
          <div className={classes.handle} data-testid="modal-card-handle" />
        </div>
        <div
          ref={contentRef}
          className={classes.modalContent}
          {...contentProps}
        >
          {children}
        </div>
      </Paper>
    );
  }
);

export default ModalCard;
