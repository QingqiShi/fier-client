import React, { useContext } from 'react';
import { render } from 'testUtils';
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
        [],
        {
          url: '/test'
        }
      );

      expect(getByText('/test')).toBeInTheDocument();
    });
  });
});
