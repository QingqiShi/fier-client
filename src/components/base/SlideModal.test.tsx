import React, { useState } from 'react';
import { act, fireEvent, render } from '@testing-library/react';
import createMockRaf, { MockRaf } from '@react-spring/mock-raf';
import { FrameLoop, Globals } from '@react-spring/web';
import { DragUtil } from 'testUtils';
import SlideModal from './SlideModal';

let mockRaf: MockRaf;
beforeEach(() => {
  mockRaf = createMockRaf();
  Globals.assign({
    now: mockRaf.now,
    requestAnimationFrame: mockRaf.raf,
    cancelAnimationFrame: mockRaf.cancel,
    frameLoop: new FrameLoop()
  });
});

test('renders children', () => {
  const { getByText } = render(
    <SlideModal open={true}>test children</SlideModal>
  );
  expect(getByText('test children')).toBeInTheDocument();
});

test('close then open again', () => {
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

  act(() => mockRaf.flush());
  expect(queryByText('content')).toBeInTheDocument();

  fireEvent.click(getByText('toggle'));
  act(() => mockRaf.flush());
  expect(queryByText('content')).toBeNull();

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

  handleClose.mockClear();
  const drag = new DragUtil(() => getByText('content'), mockRaf);
  await drag.dragStart().later(50);
  drag.dragDown(50).dragEnd();

  expect(handleClose).toHaveBeenCalled();
});

test('drag close', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} onClose={handleClose}>
      content
    </SlideModal>
  );

  handleClose.mockClear();
  const drag = new DragUtil(() => getByText('content'), mockRaf);
  await drag.dragStart().later(50);
  await drag.dragDown(200).later(50);
  drag
    .dragDown(10)
    .dragEnd()
    .wait();

  expect(handleClose).toHaveBeenCalled();
});

test('drag close with handle', async () => {
  const handleClose = jest.fn();
  const { getByTestId } = render(
    <SlideModal open={true} onClose={handleClose}>
      content
    </SlideModal>
  );

  handleClose.mockClear();
  const drag = new DragUtil(() => getByTestId('modal-card-handle'), mockRaf);
  await drag.dragStart().later(50);
  drag
    .dragDown(50)
    .dragEnd()
    .wait();

  expect(handleClose).toHaveBeenCalled();
});

test('overflow hidden while dragging', async () => {
  const { getByText } = render(<SlideModal open={true}>content</SlideModal>);

  const drag = new DragUtil(() => getByText('content'), mockRaf);
  await drag.dragStart().later(50);
  await drag
    .dragDown(50)
    .wait()
    .later(50);

  expect(getByText('content')).toHaveStyle('overflow:hidden');

  drag.dragEnd().wait();

  expect(getByText('content')).not.toHaveStyle('overflow: hidden');
});

test('flick up to open', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} onClose={handleClose}>
      content
    </SlideModal>
  );

  handleClose.mockClear();
  const drag = new DragUtil(() => getByText('content'), mockRaf);
  await drag.dragStart().later(50);
  await drag.dragDown(300).later(50);
  await drag.dragUp(50).later(50);
  drag
    .dragUp(50)
    .dragEnd()
    .wait();

  expect(handleClose).not.toHaveBeenCalled();
});

test('drag distance too short', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} onClose={handleClose}>
      content
    </SlideModal>
  );

  const drag = new DragUtil(() => getByText('content'), mockRaf);
  await drag.dragStart().later(50);
  await drag.dragDown(50).later(50);
  drag
    .dragDown(0.5)
    .dragEnd()
    .wait();

  expect(handleClose).not.toHaveBeenCalled();
});

test('prevent close modal', async () => {
  const handleClose = jest.fn();
  const { getByText } = render(
    <SlideModal open={true} preventClose onClose={handleClose}>
      content
    </SlideModal>
  );

  const drag = new DragUtil(() => getByText('content'), mockRaf);
  await drag.dragStart().later(50);
  drag
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

  const drag = new DragUtil(() => getByText('content'), mockRaf);
  await drag.dragStart().later(50);
  drag.dragDown(500).wait();

  expect(getByText('content').parentElement).toHaveStyle(
    'transform: translate3d(0,calc(0% + 59.230769230769226px),0);'
  );
});
