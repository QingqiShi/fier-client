import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import NumPad from './NumPad';

test('renders', () => {
  const { getByText, getByTestId } = render(<NumPad />);

  // Numbers
  [1, 2, 3, 4, 5, 6, 7, 8, 9, 0].forEach((n) => {
    expect(getByText(n.toString())).toBeInTheDocument();
  });

  // Buttons
  expect(getByTestId('numpad-delete')).toBeInTheDocument();
  expect(getByTestId('numpad-done')).toBeInTheDocument();
});

test('calls callback with entered number', () => {
  const handleChange = jest.fn();
  const handleDone = jest.fn();
  const { getByText, getByTestId } = render(
    <NumPad onChange={handleChange} onDone={handleDone} />
  );

  fireEvent.click(getByText('2'));
  expect(handleChange).toHaveBeenLastCalledWith('2', 2);

  fireEvent.click(getByText('8'));
  fireEvent.click(getByText('4'));
  expect(handleChange).toHaveBeenLastCalledWith('284', 284);

  fireEvent.click(getByTestId('numpad-delete'));
  expect(handleChange).toHaveBeenLastCalledWith('28', 28);

  fireEvent.click(getByText('.'));
  expect(handleChange).toHaveBeenLastCalledWith('28.', 28);

  fireEvent.click(getByText('6'));
  expect(handleChange).toHaveBeenLastCalledWith('28.6', 28.6);

  fireEvent.click(getByText('0'));
  expect(handleChange).toHaveBeenLastCalledWith('28.60', 28.6);

  fireEvent.click(getByTestId('numpad-done'));
  expect(handleDone).toHaveBeenCalled();
});

test('only allow two decimal places', () => {
  const handleChange = jest.fn();
  const { getByText } = render(<NumPad onChange={handleChange} />);

  fireEvent.click(getByText('4'));
  fireEvent.click(getByText('.'));
  fireEvent.click(getByText('6'));
  fireEvent.click(getByText('6'));
  fireEvent.click(getByText('6'));

  expect(handleChange).toHaveBeenLastCalledWith('4.66', 4.66);
});

test('ignore leading zeros', () => {
  const handleChange = jest.fn();
  const { getByText } = render(<NumPad onChange={handleChange} />);

  fireEvent.click(getByText('0'));
  fireEvent.click(getByText('0'));
  fireEvent.click(getByText('0'));

  expect(handleChange).toHaveBeenLastCalledWith('0', 0);
});

test('ignore multiple decimal points', () => {
  const handleChange = jest.fn();
  const { getByText } = render(<NumPad onChange={handleChange} />);

  fireEvent.click(getByText('.'));
  fireEvent.click(getByText('.'));
  fireEvent.click(getByText('.'));

  expect(handleChange).toHaveBeenLastCalledWith('0.', 0);
});
