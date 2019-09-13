import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Login from 'components/views/Login';
import Register from 'components/views/Register';
import Dashboard from 'components/views/Dashboard';
import Activity from 'components/views/Activity';
import Charts from 'components/views/Charts';
import Wallets from 'components/views/Wallets';
import useAuth from 'hooks/useAuth';
import useLocale from 'hooks/useLocale';

function Routes() {
  const { createPath } = useLocale(true);

  const {
    user: { receivedInitialState, isLoggedIn }
  } = useAuth(true);
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
