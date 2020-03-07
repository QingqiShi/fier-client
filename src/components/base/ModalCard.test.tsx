import React from 'react';
import { render } from '@testing-library/react';
import ModalCard from './ModalCard';

test('render children', () => {
  const { getByText } = render(<ModalCard>test</ModalCard>);
  expect(getByText('test')).toBeInTheDocument();
});

test('sets custom style', () => {
  const { getByText } = render(
    <ModalCard style={{ transform: 'translateY(233px)' }}>test</ModalCard>
  );
  expect(getByText('test')).toHaveStyle('transform: translateY(233px)');
});
