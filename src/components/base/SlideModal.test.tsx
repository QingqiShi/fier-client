import React from 'react';
import { act, render } from '@testing-library/react';
import createStub from 'raf-stub';
import { dragStart } from 'testUtils';
import SlideModal from './SlideModal';

const stub = createStub();
jest.spyOn(window, 'requestAnimationFrame').mockImplementation(stub.add);

const flushRaf = async () => {
  act(() => stub.flush());
};

afterEach(() => {
  flushRaf();
});

test('renders children', () => {
  const { getByText } = render(
    <SlideModal open={true} onClose={() => {}}>
      test children
    </SlideModal>
  );
  flushRaf();
  expect(getByText('test children')).toBeInTheDocument();
});

test('close then open again', async () => {
  const { queryByText, rerender } = render(
    <SlideModal open={true} onClose={() => {}}>
      test children
    </SlideModal>
  );
  flushRaf();
  expect(queryByText('test children')).toBeInTheDocument();

  rerender(
    <SlideModal open={false} onClose={() => {}}>
      test children
    </SlideModal>
  );
  flushRaf();
  expect(queryByText('test children')).toBeNull();

  rerender(
    <SlideModal open={true} onClose={() => {}}>
      test children
    </SlideModal>
  );
  flushRaf();
  expect(queryByText('test children')).toBeInTheDocument();
});

test('drag close', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} onClose={handleClose}>
      test children
    </SlideModal>
  );
  flushRaf();

  await dragStart(getByText('test children'), flushRaf)
    .then(({ dragDown }) => dragDown())
    .then(({ dragEnd }) => dragEnd());

  expect(handleClose).toHaveBeenCalled();
});

test('drag close with handle', async () => {
  const handleClose = jest.fn();
  const { getByTestId } = render(
    <SlideModal open={true} onClose={handleClose}>
      test children
    </SlideModal>
  );
  flushRaf();

  await dragStart(getByTestId('modal-card-handle'), flushRaf)
    .then(({ dragDown }) => dragDown())
    .then(({ dragEnd }) => dragEnd());

  expect(handleClose).toHaveBeenCalled();
});

test('overflow hidden while dragging', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} onClose={handleClose}>
      test children
    </SlideModal>
  );
  flushRaf();

  const el = getByText('test children');
  await dragStart(el, flushRaf).then(({ dragDown }) => dragDown());

  expect(el.parentElement).toHaveStyle('overflow: hidden');
});
