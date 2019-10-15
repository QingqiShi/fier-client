import React, { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
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
import Meta from './Meta';

function App() {
  const StoreProvider = useStoreProvider(settings, i18n, user, error);
  const [darkMode, setDarkMode] = useState(
    window.matchMedia
      ? !!window.matchMedia('(prefers-color-scheme: dark)').matches
      : false
  );

  useEffect(() => {
    if (window.matchMedia) {
      window
        .matchMedia('(prefers-color-scheme: dark)')
        .addListener(e => (e.matches ? setDarkMode(true) : setDarkMode(false)));
    }
  }, []);

  const theme = createMuiTheme({
    palette: {
      type: darkMode ? 'dark' : 'light',
      primary: { main: darkMode ? '#6180FF' : '#1658FF' },
      secondary: { main: darkMode ? '#FF85D4' : '#EE42B2' }
    },
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

  return (
    <HelmetProvider>
      <StoreProvider>
        <FirebaseSetup>
          <TranslationLoader>
            <Meta />
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <ErrorMessage />
              <Routes />
            </ThemeProvider>
          </TranslationLoader>
        </FirebaseSetup>
      </StoreProvider>
    </HelmetProvider>
  );
}

export default App;
