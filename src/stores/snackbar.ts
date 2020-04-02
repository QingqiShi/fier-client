import { createStore } from 'react-lit-store';

type MessageType = 'error' | 'warning' | 'info' | 'success';
type State = {
  type: MessageType;
  message: string;
  isShowing: boolean;
  actionLabel?: string;
  action?: () => void;
  hideAfter?: number;
};
const initialState: State = {
  type: 'error',
  message: '',
  isShowing: false,
  hideAfter: 60000,
};

const mutations = {
  setMessage: (
    _: State,
    {
      type,
      message,
      actionLabel,
      action,
      hideAfter = 6000,
    }: {
      type: MessageType;
      message: string;
      actionLabel?: string;
      action?: () => void;
      hideAfter?: number;
    }
  ) => ({
    type,
    message,
    actionLabel,
    action,
    hideAfter,
    isShowing: true,
  }),
  clearMessage: (_: State) => ({
    isShowing: false,
    action: undefined,
    actionLabel: undefined,
    hideAfter: 6000,
  }),
};

const store = createStore(initialState, mutations);

export default store;
