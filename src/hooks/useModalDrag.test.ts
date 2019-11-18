import { act } from '@testing-library/react-hooks';
import { dragStart, renderGestureHook } from 'testUtils';
import useModalDrag from './useModalDrag';
import createStub from 'raf-stub';

const stub = createStub();
jest.spyOn(window, 'requestAnimationFrame').mockImplementation(stub.add);

const flushRaf = async () => {
  act(() => stub.flush());
  await new Promise(resolve => setTimeout(resolve, 0));
};

afterEach(() => {
  flushRaf();
});

test('ignores drag when closed', async () => {
  const onDrag = jest.fn();
  const { el } = renderGestureHook(() => useModalDrag({ onDrag }));
  await dragStart(el, flushRaf)
    .then(({ dragUp }) => dragUp())
    .then(({ dragDown }) => dragDown());
  expect(onDrag).not.toHaveBeenCalled();
});

test('drag up slowly', async () => {
  const onDrag = jest.fn();
  const { el } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDrag })
  );
  await dragStart(el, flushRaf).then(({ dragUp }) => dragUp(50));
  expect(onDrag.mock.calls[0][0]).toBeCloseTo(-14.3, 1);
});

test('drag down at normal speed', async () => {
  const onDrag = jest.fn();
  const { el } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDrag })
  );
  await dragStart(el, flushRaf).then(({ dragDown }) => dragDown(50));
  expect(onDrag).toHaveBeenCalledWith(50);
});

test('fire dragEnd callback', async () => {
  const onDragEnd = jest.fn();
  const { el } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDragEnd })
  );
  await dragStart(el, flushRaf)
    .then(({ dragDown }) => dragDown())
    .then(({ dragEnd }) => dragEnd());
  expect(onDragEnd).toHaveBeenCalled();
});

test('flick close', async () => {
  const close = jest.fn();
  const { el } = renderGestureHook(() => useModalDrag({ isOpen: true, close }));
  await dragStart(el, flushRaf)
    .then(({ dragDown }) => dragDown(5))
    .then(({ dragEnd }) => dragEnd());
  expect(close).toHaveBeenCalled();
});

test('drag close', async () => {
  const close = jest.fn();
  const { el } = renderGestureHook(() => useModalDrag({ isOpen: true, close }));
  await dragStart(el, flushRaf)
    .then(({ dragDown }) => dragDown(200))
    .then(({ dragDown }) => dragDown(0.5))
    .then(({ dragEnd }) => dragEnd());
  expect(close).toHaveBeenCalled();
});

test('flick open', async () => {
  const close = jest.fn();
  const open = jest.fn();
  const { el } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, close, open })
  );
  await dragStart(el, flushRaf)
    .then(({ dragDown }) => dragDown(200))
    .then(({ dragDown }) => dragDown(0.5))
    .then(({ dragUp }) => dragUp(5))
    .then(({ dragEnd }) => dragEnd());
  expect(open).toHaveBeenCalled();
  expect(close).not.toHaveBeenCalled();
});

test('drag distance too short', async () => {
  const close = jest.fn();
  const open = jest.fn();
  const { el } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, close, open })
  );
  await dragStart(el, flushRaf)
    .then(({ dragDown }) => dragDown(180))
    .then(({ dragDown }) => dragDown(0.5))
    .then(({ dragEnd }) => dragEnd());
  expect(open).toHaveBeenCalled();
  expect(close).not.toHaveBeenCalled();
});

test('scroll down will cancel drag', async () => {
  const onDrag = jest.fn();
  const { el } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDrag, canScrollUp: () => true })
  );
  await dragStart(el, flushRaf)
    .then(({ dragDown }) => dragDown(5))
    .then(({ dragDown }) => dragDown(50))
    .then(({ dragEnd }) => dragEnd());
  expect(onDrag).not.toHaveBeenCalled();
});
