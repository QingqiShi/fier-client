import React from 'react';
import { Theme, createStyles, makeStyles } from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    item: {
      flexShrink: 0,
      marginRight: theme.spacing(1),
      '&:last-of-type': {
        paddingRight: 'calc(24px + env(safe-area-inset-right))',
      },
    },
  })
);

function HorizontalListItem(
  props: React.DetailedHTMLProps<
    React.HTMLAttributes<HTMLDivElement>,
    HTMLDivElement
  >
) {
  const classes = useStyles();
  return <div className={classes.item} {...props} />;
}

export default HorizontalListItem;
