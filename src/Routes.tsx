import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import Login from 'components/views/Login';
import Register from 'components/views/Register';
import Dashboard from 'components/views/Dashboard';
import Activity from 'components/views/Activity';
import Charts from 'components/views/Charts';
import Wallets from 'components/views/Wallets';
import useFirebaseAuth from 'hooks/useFirebaseAuth';
import useFirebaseSetup from 'hooks/useFirebaseSetup';
import useLocale from 'hooks/useLocale';

function Routes() {
  const { createPath } = useLocale(true);

  useFirebaseSetup();

  const {
    user: { receivedInitialState, isLoggedIn }
  } = useFirebaseAuth();
  if (!receivedInitialState) return null;

  let routes;

  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route component={Dashboard} path={createPath('/dashboard')} />
        <Route component={Activity} path={createPath('/activity')} />
        <Route component={Charts} path={createPath('/charts')} />
        <Route component={Wallets} path={createPath('/wallets')} />
        <Route render={() => <Redirect to={createPath('/dashboard')} />} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route component={Login} path={createPath('/login')} />
        <Route component={Register} path={createPath('/register')} />
        <Route render={() => <Redirect to={createPath('/login')} />} />
      </Switch>
    );
  }

  return (
    <>
      {routes}
      <Helmet>
        <link href={createPath('/manifest.json')} rel="manifest" />
      </Helmet>
    </>
  );
}

export default Routes;
