import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    list: {
      display: 'flex',
      flexWrap: 'nowrap',
      transform: 'translateZ(0)',
      overflowY: 'auto',
      height: ({ height }: { height: number }) => height,
      alignItems: 'center',
      padding: '0 calc(24px + env(safe-area-inset-right))',
    },
  })
);

function HorizontalList({
  height,
  ...props
}: React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLDivElement>,
  HTMLDivElement
> & { height: number }) {
  const classes = useStyles({ height });
  return (
    <div
      className={classes.list}
      onMouseMove={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
      {...props}
    />
  );
}

export default HorizontalList;
