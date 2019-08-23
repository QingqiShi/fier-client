import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import BottomNavigation from '@material-ui/core/BottomNavigation';
import BottomNavigationAction from '@material-ui/core/BottomNavigationAction';
import HomeIcon from '@material-ui/icons/Home';
import TimelineIcon from '@material-ui/icons/Timeline';
import AccountBalanceWalletIcon from '@material-ui/icons/AccountBalanceWallet';
import PieChartIcon from '@material-ui/icons/PieChart';
import Paper from '@material-ui/core/Paper';
import { LocaleRoute, createLocaleUrl } from 'libs/locale-router';
import i18n from 'stores/i18n';
import useTexts from 'hooks/useTexts';

const useStyles = makeStyles({
  root: {
    position: 'fixed',
    bottom: 0,
    paddingBottom: 'env(safe-area-inset-bottom)',
    width: '100%'
  }
});

function BottomNav({ value }: { value: string }) {
  const [t] = useTexts();
  const [{ locale }] = i18n.useStore();
  const classes = useStyles();

  return (
    <LocaleRoute
      render={({ history }) => {
        const handleChange = (e: React.ChangeEvent<{}>, newValue: string) => {
          history.push(createLocaleUrl(locale, newValue));
        };

        return (
          <Paper className={classes.root}>
            <BottomNavigation value={value} onChange={handleChange}>
              <BottomNavigationAction
                label={t['DASHBOARD']}
                icon={<HomeIcon />}
                value="/dashboard"
              />
              <BottomNavigationAction
                label={t['ACTIVITY']}
                icon={<TimelineIcon />}
                value="/activity"
              />
              <BottomNavigationAction
                label={t['CHARTS']}
                icon={<PieChartIcon />}
                value="/charts"
              />
              <BottomNavigationAction
                label={t['WALLETS']}
                icon={<AccountBalanceWalletIcon />}
                value="/wallets"
              />
            </BottomNavigation>
          </Paper>
        );
      }}
    />
  );
}

export default BottomNav;
