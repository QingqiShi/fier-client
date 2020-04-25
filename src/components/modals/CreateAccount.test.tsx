import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import CreateAccount from './CreateAccount';

const mockSetAccount = jest.fn();
jest.mock('stores/settings', () => ({
  __esModule: true,
  default: {
    useStore: () => [{ locale: 'en' }, { setAccount: mockSetAccount }],
  },
}));

test('renders title', () => {
  const { getByText } = render(<CreateAccount onClose={() => {}} />);
  expect(getByText('Add Account')).toBeInTheDocument();
});

test('enter values and submit', () => {
  const handleClose = jest.fn();
  const { getByText, getByLabelText } = render(
    <CreateAccount onClose={handleClose} />
  );

  expect(getByText('Add')).toBeDisabled();

  fireEvent.mouseDown(getByLabelText('Account type'));
  fireEvent.click(getByText('Debt Account'));
  fireEvent.mouseDown(getByLabelText('Currency'));
  fireEvent.click(getByText('CNY (¥)'));
  fireEvent.change(getByLabelText(/Name/), {
    target: { value: 'My Test Account' },
  });

  expect(getByText('Add')).not.toBeDisabled();

  fireEvent.click(getByText('Add'));
  expect(mockSetAccount).toHaveBeenCalledWith({
    id: 0,
    type: 'debt',
    currency: 'cny',
    name: 'My Test Account',
  });
  expect(handleClose).toHaveBeenCalled();
});
