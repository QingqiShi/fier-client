import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import {
  AppBar,
  Toolbar,
  Typography,
  useScrollTrigger
} from '@material-ui/core';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: ({
      scrolled,
      color
    }: {
      scrolled: boolean;
      color: 'default' | 'paper';
    }) => ({
      backgroundColor: scrolled
        ? theme.palette.background.paper
        : theme.palette.background[color],
      color: theme.palette.text.primary,
      height: theme.spacing(9),
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
      transition: 'background 0.5s, box-shadow 0.5s'
    }),
    toolBar: {
      minHeight: '100%'
    },
    typography: {
      fontWeight: 'bold'
    },
    spacer: {
      flexGrow: 1
    }
  })
);

function TitleBar({
  title,
  color,
  leftAction,
  rightAction
}: {
  title?: string;
  color?: 'paper' | 'default';
  leftAction?: React.ReactNode;
  rightAction?: React.ReactNode;
}) {
  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });
  const classes = useStyles({ scrolled, color: color || 'default' });
  return (
    <AppBar elevation={scrolled ? 2 : 0} className={classes.appBar}>
      <Toolbar className={classes.toolBar}>
        {leftAction}
        {title && (
          <Typography
            className={classes.typography}
            variant="h5"
            color="textPrimary"
          >
            {title}
          </Typography>
        )}
        <div className={classes.spacer} />
        {rightAction}
      </Toolbar>
    </AppBar>
  );
}

export default TitleBar;
