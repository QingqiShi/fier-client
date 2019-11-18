import React from 'react';
import { render } from '@testing-library/react';
import ModalCard from './ModalCard';

test('render children', () => {
  const { getByText } = render(<ModalCard>test</ModalCard>);
  expect(getByText('test')).toBeInTheDocument();
});

test('render drag handle', () => {
  const { getByTestId } = render(<ModalCard>test</ModalCard>);
  expect(getByTestId('modal-card-handle')).toBeInTheDocument();
});
