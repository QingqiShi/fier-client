import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ModalCardHeader from './ModalCardHeader';

test('render children', () => {
  const { getByText } = render(<ModalCardHeader>test</ModalCardHeader>);
  expect(getByText('test')).toBeInTheDocument();
});

test('attach event handlers', () => {
  const handleClick = jest.fn();
  const { getByText } = render(
    <ModalCardHeader eventHandlers={{ onMouseDown: handleClick }}>
      test
    </ModalCardHeader>
  );
  fireEvent.mouseDown(getByText('test'));
  expect(handleClick).toHaveBeenCalled();
});
