import { useContext } from 'react';
import { RouteContext } from 'libs/route-provider';

function useRoute() {
  return useContext(RouteContext);
}

export default useRoute;
