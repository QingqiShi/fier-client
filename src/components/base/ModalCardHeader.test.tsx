import React from 'react';
import { fireEvent, render } from '@testing-library/react';
import ModalCardHeader from './ModalCardHeader';

test('render children', () => {
  const { getByText, getByTestId } = render(
    <ModalCardHeader>test</ModalCardHeader>
  );
  expect(getByText('test')).toBeInTheDocument();
  expect(getByTestId('modal-card-handle')).toBeInTheDocument();
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

test('hide handle', () => {
  const { queryByTestId, container } = render(
    <ModalCardHeader hideHandle>test</ModalCardHeader>
  );
  expect(queryByTestId('modal-card-handle')).toBeNull();
  expect(container.firstChild).toHaveStyle('pointer-events: none');
});
