import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ModalCardContent from './ModalCardContent';

test('render children', () => {
  const { getByText } = render(<ModalCardContent>test</ModalCardContent>);
  expect(getByText('test')).toBeInTheDocument();
});

test('attach event handlers', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <ModalCardContent eventHandlers={{ onMouseDown: handleClick }}>
      test
    </ModalCardContent>
  );
  fireEvent.mouseDown(getByText('test'));
  expect(handleClick).toHaveBeenCalled();
});
