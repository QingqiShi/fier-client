import React from 'react';
import { fireEvent } from '@testing-library/react';
import { render } from 'testUtils';
import HorizontalList from './HorizontalList';

test('renders height', () => {
  const { getByText } = render(
    <HorizontalList height={666}>test</HorizontalList>
  );
  expect(getByText('test')).toHaveStyle('height: 666px');
});

test('stops event propagation', () => {
  const handleMouseMove = jest.fn();
  const handleTouchMove = jest.fn();
  const { getByText } = render(
    <div onMouseMove={handleMouseMove} onTouchMove={handleTouchMove}>
      <HorizontalList height={666}>test</HorizontalList>
    </div>
  );

  fireEvent.mouseMove(getByText('test'));
  expect(handleMouseMove).not.toHaveBeenCalled();

  fireEvent.touchMove(getByText('test'));
  expect(handleTouchMove).not.toHaveBeenCalled();
});
