import { act, wait } from '@testing-library/react';
import { DragUtil, renderGestureHook } from 'testUtils';
import useModalDrag from './useModalDrag';
import createStub from 'raf-stub';

const stub = createStub();
jest.spyOn(window, 'requestAnimationFrame').mockImplementation(stub.add);
jest.spyOn(window, 'cancelAnimationFrame').mockImplementation(stub.remove);

beforeEach(stub.reset);

test('ignores drag when closed', async () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() => useModalDrag({ onDrag }));
  const drag = new DragUtil(getEl, stub);

  await wait(() => {
    drag
      .dragStart()
      .dragUp(50)
      .dragDown(50);
    expect(onDrag).not.toHaveBeenCalled();
  });
});

test('drag down', async () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDrag })
  );

  await wait(() => {
    onDrag.mockClear();
    const drag = new DragUtil(getEl, stub);
    drag.dragStart().dragDown(50);

    expect(onDrag).toHaveBeenCalledWith(50, expect.any(Number));
  });
});

test('continuously drag down', async () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDrag })
  );

  await wait(() => {
    onDrag.mockClear();
    const drag = new DragUtil(getEl, stub);
    drag
      .dragStart()
      .dragDown(50)
      .dragDown(50);
    expect(onDrag).toHaveBeenCalledTimes(2);
  });
});

test('drag up beyond scroll should be slower', async () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDrag })
  );

  await wait(() => {
    onDrag.mockClear();
    const drag = new DragUtil(getEl, stub);
    drag.dragStart().dragUp(50);
    expect(onDrag.mock.calls[0][0]).toBeCloseTo(-14.3, 1);
  });
});

test('fire dragEnd callback', async () => {
  const onDragEnd = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDragEnd })
  );

  await wait(() => {
    onDragEnd.mockClear();
    const drag = new DragUtil(getEl, stub);
    drag
      .dragStart()
      .dragDown(50)
      .dragEnd();
    expect(onDragEnd).toHaveBeenCalledWith(50, expect.any(Number));
  });
});

test('scroll down will cancel drag', async () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({
      isOpen: true,
      onDrag,
      el: { scrollTop: 50, scrollHeight: 200 } as any
    })
  );

  await wait(() => {
    onDrag.mockClear();
    const drag = new DragUtil(getEl, stub);
    drag
      .dragStart()
      .dragDown(5)
      .dragDown(50)
      .dragEnd();
    expect(onDrag).not.toHaveBeenCalled();
  });
});
