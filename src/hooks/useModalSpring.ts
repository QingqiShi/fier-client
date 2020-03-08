import { useCallback, useEffect, useMemo } from 'react';
import { SpringConfig, config, useSpring } from 'react-spring';

const modalSpringConfig: SpringConfig = { mass: 1, tension: 175, friction: 19 };

const modalOpenTransform = 'translate3d(0,calc(0% + 40px),0)';
const modalCloseTransform = 'translate3d(0,calc(100% + 0px),0)';

function useModalSpring({ isOpen = false, onClose = () => {} }) {
  // The react-spring style props for open and close modals
  const openStyle = useMemo(() => {
    return {
      transform: modalOpenTransform,
      config: modalSpringConfig,
      onRest: () => {}
    };
  }, []);
  const closeStyle = useMemo(() => {
    return {
      transform: modalCloseTransform,
      config: modalSpringConfig,
      onRest: onClose
    };
  }, [onClose]);

  // Create react-spring
  const [props, set] = useSpring(() => ({
    transform: modalCloseTransform,
    config: modalSpringConfig
  }));

  // Callback for dragging the modal vertically
  const animateDrag = useCallback(
    (my: number) => {
      set({
        transform: `translate3d(0,calc(0% + ${40 + my}px),0)`,
        config: config.stiff,
        onRest: () => {}
      });
    },
    [set]
  );

  // Callback for animating the modal back to it's desired state
  const animateReset = useCallback(() => {
    set(isOpen ? openStyle : closeStyle);
  }, [closeStyle, isOpen, openStyle, set]);

  // Trigger open or close animations based on isOpen prop
  useEffect(() => {
    set(isOpen ? openStyle : closeStyle);
  }, [closeStyle, isOpen, openStyle, set]);

  return {
    props,
    animateDrag,
    animateReset
  };
}

export default useModalSpring;
