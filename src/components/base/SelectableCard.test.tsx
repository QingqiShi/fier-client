import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import SelectableCard from './SelectableCard';

test('renders', () => {
  const { getByText } = render(<SelectableCard>test</SelectableCard>);
  expect(getByText('test')).toBeInTheDocument();
});

test('can be clicked', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <SelectableCard onClick={handleClick}>test</SelectableCard>
  );
  fireEvent.click(getByText('test'));
  expect(handleClick).toHaveBeenCalled();
});
