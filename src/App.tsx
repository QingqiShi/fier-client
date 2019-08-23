import React from 'react';
import { HelmetProvider } from 'react-helmet-async';
import { createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import CssBaseline from '@material-ui/core/CssBaseline';
import { useStoreProvider } from 'libs/lit-store';
import { LocaleRouter, LocaleNormPath } from 'libs/locale-router';
import i18n from 'stores/i18n';
import user from 'stores/user';
import error from 'stores/error';
import Routes from 'views/Routes';
import BottomNav from 'components/BottomNav';
import ErrorMessage from 'components/ErrorMessage';

const theme = createMuiTheme({
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
  const StoreProvider = useStoreProvider(i18n, user, error);
  return (
    <HelmetProvider>
      <StoreProvider>
        <ThemeProvider theme={theme}>
          <LocaleRouter>
            <CssBaseline />
            <ErrorMessage />
            <Routes />
            <LocaleNormPath render={path => <BottomNav value={path} />} />
          </LocaleRouter>
        </ThemeProvider>
      </StoreProvider>
    </HelmetProvider>
  );
}

export default App;
