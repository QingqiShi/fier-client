import React from 'react';
import { Switch, Route, Redirect } from 'react-router-dom';
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
          <Route path={createPath('/dashboard')} component={Dashboard} />
          <Route path={createPath('/activity')} component={Activity} />
          <Route path={createPath('/charts')} component={Charts} />
          <Route path={createPath('/wallets')} component={Wallets} />
          <Route render={() => <Redirect to={createPath('/dashboard')} />} />
        </Switch>
      ) : (
        <Switch>
          <Route path={createPath('/login')} component={Login} />
          <Route path={createPath('/register')} component={Register} />
          <Route render={() => <Redirect to={createPath('/login')} />} />
        </Switch>
      )}
      <Helmet>
        <link rel="manifest" href={createPath('/manifest.json')} />
      </Helmet>
    </>
  );
}

export default Routes;
