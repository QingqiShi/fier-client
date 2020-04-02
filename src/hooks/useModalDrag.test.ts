import { DragUtil, renderGestureHook } from 'testUtils';
import { FrameLoop, Globals } from '@react-spring/web';
import createMockRaf, { MockRaf } from '@react-spring/mock-raf';
import useModalDrag from './useModalDrag';

let mockRaf: MockRaf;
beforeEach(() => {
  mockRaf = createMockRaf();
  Globals.assign({
    now: mockRaf.now,
    requestAnimationFrame: mockRaf.raf,
    cancelAnimationFrame: mockRaf.cancel,
    frameLoop: new FrameLoop(),
  });
});

test('ignores drag when closed', () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() => useModalDrag({ onDrag }));
  const drag = new DragUtil(getEl, mockRaf);

  drag.dragStart().dragUp(50).dragDown(50);
  expect(onDrag).not.toHaveBeenCalled();
});

test('drag down', async () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDrag })
  );

  const drag = new DragUtil(getEl, mockRaf);
  await drag.dragStart().later(50);
  drag.dragDown(50).wait();

  expect(onDrag).toHaveBeenCalledWith(50, expect.any(Number));
});

test('continuously drag down', async () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDrag })
  );

  const drag = new DragUtil(getEl, mockRaf);
  await drag.dragStart().later(50);
  await drag.dragDown(50).later(50);
  drag.dragDown(50).wait();
  expect(onDrag).toHaveBeenCalledTimes(2);
});

test('drag up beyond scroll should be slower', async () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDrag })
  );

  const drag = new DragUtil(getEl, mockRaf);
  await drag.dragStart().later(50);
  drag.dragUp(50).wait();
  expect(onDrag.mock.calls[0][0]).toBeCloseTo(-14.3, 1);
});

test('fire dragEnd callback', async () => {
  const onDragEnd = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({ isOpen: true, onDragEnd })
  );

  const drag = new DragUtil(getEl, mockRaf);
  await drag.dragStart().later(50);
  drag.dragDown(50).dragEnd().wait();
  expect(onDragEnd).toHaveBeenCalledWith(50, expect.any(Number));
});

test('scroll down will cancel drag', async () => {
  const onDrag = jest.fn();
  const { getEl } = renderGestureHook(() =>
    useModalDrag({
      isOpen: true,
      onDrag,
      el: { scrollTop: 50, scrollHeight: 200 } as any,
    })
  );

  const drag = new DragUtil(getEl, mockRaf);
  await drag.dragStart().later(50);
  await drag.dragDown(5).later(50);
  drag.dragDown(50).dragEnd().wait();
  expect(onDrag).not.toHaveBeenCalled();
});
