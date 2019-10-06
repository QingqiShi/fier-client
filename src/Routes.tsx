import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import PageLoadIndicator from 'components/base/PageLoadIndicator';
import settings from 'stores/settings';
import user from 'stores/user';
import useRoute from 'hooks/useRoute';

const LazyBottomNav = lazy(() =>
  import(/* webpackChunkName: "user" */ 'components/app/BottomNav')
);
const LazyDashboard = lazy(() =>
  import(/* webpackChunkName: "user" */ 'components/views/Dashboard')
);
const LazyActivity = lazy(() =>
  import(/* webpackChunkName: "user" */ 'components/views/Activity')
);
const LazyCharts = lazy(() =>
  import(/* webpackChunkName: "user" */ 'components/views/Charts')
);
const LazyWallets = lazy(() =>
  import(/* webpackChunkName: "user" */ 'components/views/Wallets')
);

const LazyLogin = lazy(() =>
  import(/* webpackChunkName: "guest" */ 'components/views/Login')
);
const LazyRegister = lazy(() =>
  import(/* webpackChunkName: "guest" */ 'components/views/Register')
);

function Routes() {
  const [{ isLoggedIn }] = user.useStore();
  const [{ locale }] = settings.useStore();

  const { routeLocale, routePath, redirect, getPath } = useRoute();

  if (routeLocale !== locale) {
    redirect(routePath, locale);
    return null;
  }

  return (
    <Suspense fallback={<PageLoadIndicator />}>
      {isLoggedIn ? (
        <>
          <Switch>
            <Route component={LazyDashboard} path={getPath('/dashboard')} />
            <Route component={LazyActivity} path={getPath('/activity')} />
            <Route component={LazyCharts} path={getPath('/charts')} />
            <Route component={LazyWallets} path={getPath('/wallets')} />
            <Route render={() => <Redirect to={getPath('/dashboard')} />} />
          </Switch>
          <LazyBottomNav />
        </>
      ) : (
        <Switch>
          <Route component={LazyLogin} path={getPath('/login')} />
          <Route component={LazyRegister} path={getPath('/register')} />
          <Route render={() => <Redirect to={getPath('/login')} />} />
        </Switch>
      )}
    </Suspense>
  );
}

export default Routes;
