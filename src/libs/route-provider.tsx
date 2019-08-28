import React, { createContext } from 'react';
import { Route } from 'react-router-dom';
import {
  Location,
  History,
  createLocation,
  createMemoryHistory
} from 'history';

export const RouteContext = createContext<{
  location: Location;
  history: History;
}>({
  location: createLocation('/'),
  history: createMemoryHistory()
});

export function RouteProvider({ children }: React.PropsWithChildren<{}>) {
  return (
    <Route
      render={route => {
        return (
          <RouteContext.Provider
            value={{ location: route.location, history: route.history }}
          >
            {children}
          </RouteContext.Provider>
        );
      }}
    />
  );
}
