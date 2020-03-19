import React, { Suspense, lazy, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import PageLoadIndicator from 'components/base/PageLoadIndicator';
import SlideModal from 'components/base/SlideModal';
import settings from 'stores/settings';
import user from 'stores/user';
import useRoute from 'hooks/useRoute';
import useModalHash, { Modal } from 'hooks/useModalHash';

// Registered user
const LazyBottomNav = lazy(() => import('components/app/BottomNav'));
const LazyDashboard = lazy(() => import('components/views/Dashboard'));
const LazyActivity = lazy(() => import('components/views/Activity'));
const LazyCharts = lazy(() => import('components/views/Charts'));
const LazyWallets = lazy(() => import('components/views/Wallets'));

// Guest user
const LazyLogin = lazy(() => import('components/views/Login'));
const LazyRegister = lazy(() => import('components/views/Register'));

// Modals
const LazyProfile = lazy(() => import('components/modals/Profile'));
const LazyCreate = lazy(() => import('components/modals/Create'));
const LazySetup = lazy(() => import('components/modals/Setup'));

function Routes() {
  const [{ isLoggedIn }] = user.useStore();
  const [{ locale, categories }] = settings.useStore();
  const { loaded: settingsLoaded } = settings.useMeta();

  const { routeLocale, routePath, redirect, getPath } = useRoute();
  const { isOpen: profileIsOpen, close } = useModalHash(Modal.PROFILE);
  const { isOpen: createIsOpen } = useModalHash(Modal.CREATE);
  const { isOpen: setupIsOpen, open: openSetup } = useModalHash(Modal.SETUP);

  useEffect(() => {
    if (routeLocale !== locale) {
      redirect(routePath, locale);
    }
  }, [locale, redirect, routeLocale, routePath]);

  useEffect(() => {
    if (isLoggedIn && settingsLoaded && !categories.length && !setupIsOpen) {
      openSetup();
    }
  }, [categories.length, isLoggedIn, openSetup, settingsLoaded, setupIsOpen]);

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

      <SlideModal open={profileIsOpen} onClose={close}>
        <LazyProfile />
      </SlideModal>
      <SlideModal open={createIsOpen} onClose={close}>
        <LazyCreate onClose={close} />
      </SlideModal>
      <SlideModal
        open={setupIsOpen}
        preventClose={!categories.length}
        onClose={close}
      >
        <LazySetup onClose={close} />
      </SlideModal>
    </Suspense>
  );
}

export default Routes;
