import React, { Suspense, lazy, useEffect } from 'react';
import { Redirect, Route, Switch } from 'react-router';
import PageLoadIndicator from 'components/base/PageLoadIndicator';
import SlideModal from 'components/base/SlideModal';
import settings from 'stores/settings';
import user from 'stores/user';
import snackbar from 'stores/snackbar';
import useRoute from 'hooks/useRoute';
import useModalHash, { Modal } from 'hooks/useModalHash';
import useText from 'hooks/useTexts';

// Registered user
const LazyDashboard = lazy(() => import('components/views/Dashboard'));

// Guest user
const LazyLogin = lazy(() => import('components/views/Login'));
const LazyRegister = lazy(() => import('components/views/Register'));

// Modals
const LazyProfile = lazy(() => import('components/modals/Profile'));
const LazyCreate = lazy(() => import('components/modals/CreateTransaction'));
const LazyCreateAccount = lazy(() => import('components/modals/CreateAccount'));
const LazySetupCategories = lazy(() =>
  import('components/modals/SetupCategories')
);

function Routes() {
  const [{ isLoggedIn }] = user.useStore();
  const [{ locale, categories }] = settings.useStore();
  const [, { setMessage }] = snackbar.useStore();
  const [t] = useText();

  const { routeLocale, routePath, redirect, getPath } = useRoute();
  const { isOpen: profileIsOpen, close } = useModalHash(Modal.PROFILE);
  const { isOpen: setupIsOpen } = useModalHash(Modal.SETUP);
  const { isOpen: createAccountIsOpen } = useModalHash(Modal.CREATE_ACCOUNT);
  const { isOpen: newIsOpen } = useModalHash(Modal.CREATE_TRANSACTION);

  useEffect(() => {
    if (routeLocale !== locale) {
      redirect(routePath, locale);
    }
  }, [locale, redirect, routeLocale, routePath]);

  const updateAvailableMessage = t['UPDATE_AVAILABLE_MESSAGE'];
  const updateNowText = t['UPDATE_NOW'];

  useEffect(() => {
    function updateCallback() {
      setMessage({
        hideAfter: 0,
        type: 'warning',
        message: updateAvailableMessage,
        actionLabel: updateNowText,
        action: window.swStates.updateAndReload,
      });
    }

    if (window.swStates.updated) {
      updateCallback();
    } else {
      window.swStates.callback = updateCallback;
      return () => {
        window.swStates.callback = undefined;
      };
    }
  }, [setMessage, updateAvailableMessage, updateNowText]);

  return (
    <Suspense fallback={<PageLoadIndicator />}>
      {isLoggedIn ? (
        <>
          <Switch>
            <Route component={LazyDashboard} path={getPath('/dashboard')} />
            <Route render={() => <Redirect to={getPath('/dashboard')} />} />
          </Switch>
          {/* <LazyBottomNav /> */}
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
      <SlideModal height={470} open={createAccountIsOpen} onClose={close}>
        <LazyCreateAccount />
      </SlideModal>
      <SlideModal
        open={setupIsOpen}
        preventClose={!categories.length}
        onClose={close}
      >
        <LazySetupCategories onClose={close} />
      </SlideModal>
      <SlideModal open={newIsOpen} onClose={close}>
        <LazyCreate onClose={close} />
      </SlideModal>
    </Suspense>
  );
}

export default Routes;
