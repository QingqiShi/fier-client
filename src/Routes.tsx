import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLoader from 'components/base/PageLoader';
import useFirebaseSetup from 'hooks/useFirebaseSetup';
import user from 'stores/user';
import useLocale from 'hooks/useLocale';

const LazyBottomNav = lazy(() =>
  import(/* webpackChunkName: "loggednInViews" */ 'components/app/BottomNav')
);
const LazyDashboard = lazy(() =>
  import(/* webpackChunkName: "loggednInViews" */ 'components/views/Dashboard')
);
const LazyActivity = lazy(() =>
  import(/* webpackChunkName: "loggednInViews" */ 'components/views/Activity')
);
const LazyCharts = lazy(() =>
  import(/* webpackChunkName: "loggednInViews" */ 'components/views/Charts')
);
const LazyWallets = lazy(() =>
  import(/* webpackChunkName: "loggednInViews" */ 'components/views/Wallets')
);

const LazyLogin = lazy(() =>
  import(/* webpackChunkName: "guestViews" */ 'components/views/Login')
);
const LazyRegister = lazy(() =>
  import(/* webpackChunkName: "guestViews" */ 'components/views/Register')
);

function Routes() {
  const ready = useFirebaseSetup();

  const [{ isLoggedIn }] = user.useStore();
  const { createPath } = useLocale(ready);

  if (!ready) return null;

  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route component={LazyDashboard} path={createPath('/dashboard')} />
        <Route component={LazyActivity} path={createPath('/activity')} />
        <Route component={LazyCharts} path={createPath('/charts')} />
        <Route component={LazyWallets} path={createPath('/wallets')} />
        <Route render={() => <Redirect to={createPath('/dashboard')} />} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route component={LazyLogin} path={createPath('/login')} />
        <Route component={LazyRegister} path={createPath('/register')} />
        <Route render={() => <Redirect to={createPath('/login')} />} />
      </Switch>
    );
  }

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <>
          {routes}
          {isLoggedIn && <LazyBottomNav />}
        </>
      </Suspense>
      <Helmet>
        <link href={createPath('/manifest.json')} rel="manifest" />
      </Helmet>
    </>
  );
}

export default Routes;
