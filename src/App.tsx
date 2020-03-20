import React, { useEffect, useState } from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { ThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useStoreProvider } from 'react-lit-store';
import i18n from 'stores/i18n';
import user from 'stores/user';
import snackbar from 'stores/snackbar';
import settings from 'stores/settings';
import sw from 'stores/sw';
import SnackbarMessage from 'components/app/SnackbarMessage';
import TranslationLoader from 'components/app/TranslationLoader';
import FirebaseSetup from 'components/app/FirebaseSetup';
import Routes from './Routes';
import Meta from './Meta';

// Extend theme variables
declare module '@material-ui/core/styles/createPalette' {
  interface TypeBackground {
    level1: string;
  }
}

function App() {
  const StoreProvider = useStoreProvider(settings, i18n, user, snackbar, sw);
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
      secondary: { main: darkMode ? '#FF85D4' : '#EE42B2' },
      background: {
        default: darkMode ? '#121212' : '#F7F7F7',
        paper: darkMode ? '#212121' : '#FFF'
      }
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
  theme.palette.background.level1 = darkMode ? '#2e2e2e' : '#FFF';

  return (
    <HelmetProvider>
      <StoreProvider>
        <FirebaseSetup>
          <TranslationLoader>
            <Meta />
            <ThemeProvider theme={theme}>
              <CssBaseline />
              <SnackbarMessage />
              <Routes />
            </ThemeProvider>
          </TranslationLoader>
        </FirebaseSetup>
      </StoreProvider>
    </HelmetProvider>
  );
}

export default App;
