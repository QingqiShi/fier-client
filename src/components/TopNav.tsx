import React from 'react';
import { createStyles, Theme, makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton/IconButton';
import useScrollTrigger from '@material-ui/core/useScrollTrigger';
import AccountCircle from '@material-ui/icons/AccountCircle';
import AddBox from '@material-ui/icons/AddBox';

const useStyles = makeStyles((theme: Theme) =>
  createStyles({
    appBar: {
      backgroundColor: theme.palette.background.paper,
      height: theme.spacing(9),
      paddingLeft: 'env(safe-area-inset-left)',
      paddingRight: 'env(safe-area-inset-right)',
      transition: 'background 0.5s, box-shadow 0.5s'
    },
    appBarExpand: {
      backgroundColor: theme.palette.background.default
    },
    toolBar: {
      minHeight: '100%'
    },
    largeIcon: {
      fontSize: theme.typography.h4.fontSize
    },
    typography: {
      fontWeight: 'bold'
    },
    grow: {
      flexGrow: 1
    }
  })
);

function TopNav({ title }: { title: string }) {
  const classes = useStyles();
  const scrolled = useScrollTrigger({
    disableHysteresis: true,
    threshold: 0
  });

  return (
    <AppBar
      elevation={scrolled ? 2 : 0}
      className={`${classes.appBar} ${!scrolled ? classes.appBarExpand : ''}`}
    >
      <Toolbar className={classes.toolBar}>
        <IconButton edge="start" data-testid="account-icon-button">
          <AccountCircle className={classes.largeIcon} />
        </IconButton>
        <Typography
          className={classes.typography}
          variant="h5"
          color="textPrimary"
        >
          {title}
        </Typography>
        <div className={classes.grow} />
        <IconButton edge="end" color="primary" data-testid="add-icon-button">
          <AddBox />
        </IconButton>
      </Toolbar>
    </AppBar>
  );
}

export default TopNav;
