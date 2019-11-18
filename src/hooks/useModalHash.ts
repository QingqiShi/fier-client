import { useCallback } from 'react';
import useRoute from 'hooks/useRoute';

export enum Modal {
  PROFILE = '#profile',
  CREATE = '#create',
  SETUP = '#setup'
}

function useModalHash(modal: Modal) {
  const { routeHash, setHash } = useRoute();

  return {
    isOpen: routeHash === modal,
    open: useCallback(() => setHash(modal), [modal, setHash]),
    close: useCallback(() => setHash(''), [setHash])
  };
}

export default useModalHash;
