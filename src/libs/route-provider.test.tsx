import React, { useContext } from 'react';
import { MemoryRouter } from 'react-router-dom';
import { render } from '@testing-library/react';
import { RouteContext, RouteProvider } from './route-provider';

describe('libs/route-provider', () => {
  describe('RouteContext', () => {
    it('stores location with pathname ', () => {
      const Component = () => {
        const { location } = useContext(RouteContext);
        return <div>{location.pathname}</div>;
      };
      const { getByText } = render(
        <RouteProvider>
          <Component />
        </RouteProvider>,
        {
          wrapper: ({ children }: React.PropsWithChildren<{}>) => (
            <MemoryRouter initialEntries={['/test']}>{children}</MemoryRouter>
          )
        }
      );

      expect(getByText('/test')).toBeInTheDocument();
    });
  });
});
