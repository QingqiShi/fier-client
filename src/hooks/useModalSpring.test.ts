import { useEffect } from 'react';
import { act } from '@testing-library/react';
import { renderSpringHook } from 'testUtils';
import createMockRaf, { MockRaf } from '@react-spring/mock-raf';
import { FrameLoop, Globals } from '@react-spring/web';
import useModalSpring from './useModalSpring';

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

beforeEach(jest.clearAllMocks);

test('closed modal style', () => {
  const { getEl } = renderSpringHook(() => {
    const { props } = useModalSpring({});
    return { style: props };
  });
  act(() => mockRaf.flush());
  expect(getEl()).toHaveStyle('transform: translate3d(0,calc(100% + 0px),0)');
});

test('open modal style', () => {
  const { getEl } = renderSpringHook(() => {
    const { props } = useModalSpring({ isOpen: true });
    return { style: props };
  });
  act(() => mockRaf.flush());
  expect(getEl()).toHaveStyle('transform: translate3d(0,calc(0% + 40px),0)');
});

test('drag modal style', () => {
  const { getEl } = renderSpringHook(() => {
    const { props, animateDrag } = useModalSpring({ isOpen: true });
    useEffect(() => {
      animateDrag(50);
    }, [animateDrag]);
    return { style: props };
  });
  act(() => mockRaf.flush());
  expect(getEl()).toHaveStyle('transform: translate3d(0,calc(0% + 90px),0)');
});

test('reset modal to open style', () => {
  const { getEl } = renderSpringHook(() => {
    const { props, animateDrag, animateReset } = useModalSpring({
      isOpen: true,
    });
    useEffect(() => {
      animateDrag(50);
      animateReset();
    }, [animateDrag, animateReset]);
    return { style: props };
  });
  act(() => mockRaf.flush());
  expect(getEl()).toHaveStyle('transform: translate3d(0,calc(0% + 40px),0)');
});

test('reset modal to close style', () => {
  const { getEl } = renderSpringHook(() => {
    const { props, animateDrag, animateReset } = useModalSpring({
      isOpen: false,
    });
    useEffect(() => {
      animateDrag(50);
      animateReset();
    }, [animateDrag, animateReset]);
    return { style: props };
  });
  act(() => mockRaf.flush());
  expect(getEl()).toHaveStyle('transform: translate3d(0,calc(100% + 0px),0)');
});

test('fire onClose callback', () => {
  const handleClose = jest.fn();
  let isOpen = true;
  const { rerender } = renderSpringHook(
    () =>
      useModalSpring({
        isOpen,
        onClose: handleClose,
      }).props
  );
  act(() => mockRaf.flush());
  expect(handleClose).not.toHaveBeenCalled();

  isOpen = false;
  rerender();
  act(() => mockRaf.flush());

  expect(handleClose).toHaveBeenCalledTimes(1);
});
