import React, { forwardRef } from 'react';
import { createStyles, makeStyles } from '@material-ui/core/styles';
import { ReactEventHandlers } from 'react-use-gesture/dist/types';

const useStyles = makeStyles(theme =>
  createStyles({
    contentRoot: {
      padding: `calc(${theme.spacing(8)}px) calc(${theme.spacing(
        3
      )}px + env(safe-area-inset-right)) calc(env(safe-area-inset-bottom) + 40px + ${theme.spacing(
        3
      )}px) calc(${theme.spacing(3)}px + env(safe-area-inset-left))`,
      height: '100%',
      overflowY: 'scroll'
    }
  })
);

type ModalCardContentProps = React.PropsWithChildren<{
  eventHandlers?: ReactEventHandlers;
}>;

const ModalCardContent = forwardRef<HTMLDivElement, ModalCardContentProps>(
  ({ children, eventHandlers }, ref) => {
    const classes = useStyles();

    return (
      <div ref={ref} className={classes.contentRoot} {...eventHandlers}>
        {children}
      </div>
    );
  }
);

export default ModalCardContent;
