import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import {
  BottomNavigation,
  BottomNavigationAction,
  Paper
} from '@material-ui/core';
import {
  Home,
  Timeline,
  AccountBalanceWallet,
  PieChart
} from '@material-ui/icons';
import useTexts from 'hooks/useTexts';
import useRoute from 'hooks/useRoute';
import useLocale from 'hooks/useLocale';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    bottom: 0,
    paddingBottom: 'env(safe-area-inset-bottom)',
    width: '100%'
  }
});

const navigationConfig = [
  { label: 'DASHBOARD', icon: Home, value: '/dashboard' },
  { label: 'ACTIVITY', icon: Timeline, value: '/activity' },
  { label: 'CHARTS', icon: PieChart, value: '/charts' },
  { label: 'WALLETS', icon: AccountBalanceWallet, value: '/wallets' }
];

function BottomNav() {
  const [t] = useTexts();
  const classes = useStyles();
  const { location, history } = useRoute();
  const { path, createPath } = useLocale();

  const selectedNav =
    navigationConfig.find(config => path.match(new RegExp(config.value))) ||
    navigationConfig[0];

  const handleChange = (e: React.ChangeEvent<{}>, newValue: string) => {
    history.push({ ...location, pathname: createPath(newValue) });
  };

  return (
    <Paper className={classes.root}>
      <BottomNavigation value={selectedNav.value} onChange={handleChange}>
        {navigationConfig.map(nav => (
          <BottomNavigationAction
            key={`bottom-nav-${nav.value}`}
            label={t[nav.label]}
            icon={<nav.icon />}
            value={nav.value}
          />
        ))}
      </BottomNavigation>
    </Paper>
  );
}

export default BottomNav;
