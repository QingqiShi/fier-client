import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Login from 'views/Login';
import Register from 'views/Register';
import Dashboard from 'views/Dashboard';
import Activity from 'views/Activity';
import Charts from 'views/Charts';
import Wallets from 'views/Wallets';
import useAuth from 'hooks/useAuth';
import useLocale from 'hooks/useLocale';

function Routes() {
  const { createPath } = useLocale(true);

  const {
    user: { receivedInitialState, isLoggedIn }
  } = useAuth();
  if (!receivedInitialState) return null;

  return (
    <>
      {isLoggedIn ? (
        <Switch>
          <Route component={Dashboard} path={createPath('/dashboard')} />
          <Route component={Activity} path={createPath('/activity')} />
          <Route component={Charts} path={createPath('/charts')} />
          <Route component={Wallets} path={createPath('/wallets')} />
          <Route render={() => <Redirect to={createPath('/dashboard')} />} />
        </Switch>
      ) : (
        <Switch>
          <Route component={Login} path={createPath('/login')} />
          <Route component={Register} path={createPath('/register')} />
          <Route render={() => <Redirect to={createPath('/login')} />} />
        </Switch>
      )}
      <Helmet>
        <link href={createPath('/manifest.json')} rel="manifest" />
      </Helmet>
    </>
  );
}

export default Routes;
