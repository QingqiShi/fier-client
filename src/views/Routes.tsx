import React from 'react';
import { LocaleSwitch, LocaleRoute, LocaleRedirect } from 'libs/locale-router';
import user from 'stores/user';
import Login from './Login';
import Register from './Register';
import Dashboard from './Dashboard';
import Activity from './Activity';
import Charts from './Charts';
import Wallets from './Wallets';

function Routes() {
  const [{ isLoggedIn }] = user.useStore();
  return (
    <LocaleSwitch>
      {isLoggedIn ? (
        <>
          <LocaleRoute path="/dashboard" component={Dashboard} />
          <LocaleRoute path="/activity" component={Activity} />
          <LocaleRoute path="/charts" component={Charts} />
          <LocaleRoute path="/wallets" component={Wallets} />
          <LocaleRoute render={() => <LocaleRedirect to="/dashboard" />} />
        </>
      ) : (
        <>
          <LocaleRoute path="/login" component={Login} />
          <LocaleRoute path="/register" component={Register} />
          <LocaleRoute render={() => <LocaleRedirect to="/login" />} />
        </>
      )}
    </LocaleSwitch>
  );
}

export default Routes;
