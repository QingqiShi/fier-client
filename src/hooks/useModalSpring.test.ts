import { renderSpringHook } from 'testUtils';
import useModalSpring from './useModalSpring';

jest.useFakeTimers();
jest
  .spyOn(window, 'requestAnimationFrame')
  .mockImplementation(cb => setTimeout(cb, 0));

beforeEach(jest.clearAllMocks);

test('closed modal style', () => {
  const { el } = renderSpringHook(() => useModalSpring({}).props);
  jest.runAllTimers();

  expect(el).toHaveStyle('transform: translate3d(0,calc(100% + 0px),0)');
});

test('open modal style', () => {
  const { el } = renderSpringHook(() => useModalSpring({ isOpen: true }).props);
  jest.runAllTimers();

  expect(el).toHaveStyle('transform: translate3d(0,calc(5% + 0px),0)');
});

test('drag modal style', () => {
  const { el } = renderSpringHook(() => {
    const { props, animateDrag } = useModalSpring({ isOpen: true });
    setTimeout(() => animateDrag(50), 0);
    return props;
  });
  jest.runAllTimers();

  expect(el).toHaveStyle('transform: translate3d(0,calc(5% + 50px),0)');
});

test('reset modal to open style', () => {
  const { el } = renderSpringHook(() => {
    const { props, animateDrag, animateReset } = useModalSpring({
      isOpen: true
    });
    setTimeout(() => animateDrag(50), 0);
    setTimeout(() => animateReset(), 20);
    return props;
  });
  jest.runAllTimers();

  expect(el).toHaveStyle('transform: translate3d(0,calc(5% + 0px),0)');
});

test('reset modal to close style', () => {
  const { el } = renderSpringHook(() => {
    const { props, animateDrag, animateReset } = useModalSpring({
      isOpen: false
    });
    setTimeout(() => animateDrag(50), 0);
    setTimeout(() => animateReset(), 20);
    return props;
  });
  jest.runAllTimers();

  expect(el).toHaveStyle('transform: translate3d(0,calc(100% + 0px),0)');
});

test('fire onClose callback', () => {
  const handleClose = jest.fn();
  let isOpen = true;
  const { rerender } = renderSpringHook(
    () =>
      useModalSpring({
        isOpen,
        onClose: handleClose
      }).props
  );
  jest.runAllTimers();

  expect(handleClose).not.toHaveBeenCalled();

  isOpen = false;
  rerender();
  jest.runAllTimers();

  expect(handleClose).toHaveBeenCalledTimes(1);
});
