import React, { Suspense, lazy } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';
import PageLoader from 'components/base/PageLoader';
import useFirebaseSetup from 'hooks/useFirebaseSetup';
import user from 'stores/user';
import useLocale from 'hooks/useLocale';

const LazyBottomNav = lazy(() => import('components/app/BottomNav'));

function Routes() {
  const ready = useFirebaseSetup();

  const [{ isLoggedIn }] = user.useStore();
  const { createPath } = useLocale(ready);

  if (!ready) return null;

  let routes;
  if (isLoggedIn) {
    routes = (
      <Switch>
        <Route
          component={lazy(() =>
            import(
              /* webpackChunkName: "loggednInViews" */ 'components/views/Dashboard'
            )
          )}
          path={createPath('/dashboard')}
        />
        <Route
          component={lazy(() =>
            import(
              /* webpackChunkName: "loggednInViews" */ 'components/views/Activity'
            )
          )}
          path={createPath('/activity')}
        />
        <Route
          component={lazy(() =>
            import(
              /* webpackChunkName: "loggednInViews" */ 'components/views/Charts'
            )
          )}
          path={createPath('/charts')}
        />
        <Route
          component={lazy(() =>
            import(
              /* webpackChunkName: "loggednInViews" */ 'components/views/Wallets'
            )
          )}
          path={createPath('/wallets')}
        />
        <Route render={() => <Redirect to={createPath('/dashboard')} />} />
      </Switch>
    );
  } else {
    routes = (
      <Switch>
        <Route
          component={lazy(() =>
            import(
              /* webpackChunkName: "guestViews" */ 'components/views/Login'
            )
          )}
          path={createPath('/login')}
        />
        <Route
          component={lazy(() =>
            import(
              /* webpackChunkName: "guestViews" */ 'components/views/Register'
            )
          )}
          path={createPath('/register')}
        />
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
