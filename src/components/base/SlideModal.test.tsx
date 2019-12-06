import React, { useState } from 'react';
import { act, fireEvent, render, wait } from '@testing-library/react';
import createStub from 'raf-stub';
import { DragUtil } from 'testUtils';
import SlideModal from './SlideModal';

const stub = createStub();
jest.spyOn(window, 'requestAnimationFrame').mockImplementation(stub.add);
jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(stub.remove);

beforeEach(stub.reset);
afterEach(() => {
  stub.flush();
});

test('renders children', () => {
  const { getByText } = render(
    <SlideModal open={true}>test children</SlideModal>
  );
  expect(getByText('test children')).toBeInTheDocument();
});

test('close then open again', async () => {
  const Component = () => {
    const [open, setOpen] = useState(true);
    return (
      <div>
        <SlideModal open={open}>content</SlideModal>
        <button onClick={() => setOpen(!open)}>toggle</button>
      </div>
    );
  };
  const { getByText, queryByText } = render(<Component />);

  stub.flush();
  expect(queryByText('content')).toBeInTheDocument();

  fireEvent.click(getByText('toggle'));
  await wait(() => {
    act(() => stub.flush());
    expect(queryByText('content')).toBeNull();
  });

  fireEvent.click(getByText('toggle'));
  expect(queryByText('content')).toBeInTheDocument();
});

test('flick close', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} onClose={handleClose}>
      content
    </SlideModal>
  );

  await wait(() => {
    handleClose.mockClear();
    const drag = new DragUtil(() => getByText('content'), stub);
    drag
      .dragStart()
      .dragDown(50)
      .dragEnd();

    expect(handleClose).toHaveBeenCalled();
  });
});

test('drag close', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} onClose={handleClose}>
      content
    </SlideModal>
  );

  await wait(() => {
    handleClose.mockClear();
    const drag = new DragUtil(() => getByText('content'), stub);
    drag
      .dragStart()
      .dragDown(200)
      .tick(1)
      .dragDown(0.1)
      .dragEnd();

    expect(handleClose).toHaveBeenCalled();
  });
});

test('drag close with handle', async () => {
  const handleClose = jest.fn();
  const { getByTestId } = render(
    <SlideModal open={true} onClose={handleClose}>
      content
    </SlideModal>
  );

  await wait(() => {
    handleClose.mockClear();
    const drag = new DragUtil(() => getByTestId('modal-card-handle'), stub);
    drag
      .dragStart()
      .dragDown(50)
      .dragEnd();

    expect(handleClose).toHaveBeenCalled();
  });
});

test('overflow hidden while dragging', async () => {
  const { getByText } = render(<SlideModal open={true}>content</SlideModal>);

  await wait(() => {
    const drag = new DragUtil(() => getByText('content'), stub);
    drag
      .dragStart()
      .tick(1)
      .dragDown(50)
      .wait();

    expect(getByText('content')).toHaveStyle('overflow:hidden');

    drag.dragEnd().wait();

    expect(getByText('content')).not.toHaveStyle('overflow: hidden');
  });
});

test('flick up to open', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} onClose={handleClose}>
      content
    </SlideModal>
  );

  await wait(() => {
    handleClose.mockClear();
    const drag = new DragUtil(() => getByText('content'), stub);
    drag
      .wait()
      .dragStart()
      .dragDown(300)
      .tick(1)
      .dragUp(50)
      .tick(1)
      .dragUp(50)
      .dragEnd()
      .wait();

    expect(handleClose).not.toHaveBeenCalled();
  });
});

test('drag distance too short', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} onClose={handleClose}>
      content
    </SlideModal>
  );

  const drag = new DragUtil(() => getByText('content'), stub);
  drag
    .dragStart()
    .dragDown(50)
    .dragDown(0.5)
    .dragEnd()
    .wait();

  expect(handleClose).not.toHaveBeenCalled();
});

test('prevent close modal', () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} preventClose onClose={handleClose}>
      content
    </SlideModal>
  );

  const drag = new DragUtil(() => getByText('content'), stub);
  drag
    .dragStart()
    .dragDown(50)
    .dragEnd()
    .wait();

  expect(handleClose).not.toHaveBeenCalled();
});

test('drag down slowly when prevent close', async () => {
  const { getByText } = render(
    <SlideModal open={true} preventClose>
      content
    </SlideModal>
  );

  await wait(() => {
    const drag = new DragUtil(() => getByText('content'), stub);
    drag
      .dragStart()
      .dragDown(500)
      .wait();

    expect(getByText('content').parentElement).toHaveStyle(
      'transform: translate3d(0,calc(5% + 19.23076923076923px),0);'
    );

    drag.dragEnd();
  });
});
