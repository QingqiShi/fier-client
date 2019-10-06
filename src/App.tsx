import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useStoreProvider } from 'react-lit-store';
import i18n from 'stores/i18n';
import user from 'stores/user';
import error from 'stores/error';
import settings from 'stores/settings';
import ErrorMessage from 'components/app/ErrorMessage';
import TranslationLoader from 'components/app/TranslationLoader';
import FirebaseSetup from 'components/app/FirebaseSetup';
import Routes from './Routes';

const theme = createMuiTheme({
  shape: {
    borderRadius: 20
  },
  overrides: {
    MuiButton: {
      root: {
        overflow: 'hidden',
        borderRadius: 21
      }
    }
  }
});

function App() {
  const StoreProvider = useStoreProvider(settings, i18n, user, error);

  return (
    <HelmetProvider>
      <StoreProvider>
        <TranslationLoader />
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <ErrorMessage />
          <FirebaseSetup>
            <Routes />
          </FirebaseSetup>
        </ThemeProvider>
      </StoreProvider>
    </HelmetProvider>
  );
}

export default App;
