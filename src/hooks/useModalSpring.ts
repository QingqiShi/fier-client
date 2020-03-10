import { useCallback, useEffect, useMemo } from 'react';
import { SpringConfig, config, to, useSpring } from '@react-spring/web';

const modalSpringConfig: SpringConfig = { mass: 1, tension: 175, friction: 19 };

const modalOpenTo = { y: 40, percent: 0 };
const modalCloseTo = { y: 0, percent: 100 };

const getTransform = (y: number, percent: number) =>
  `translate3d(0,calc(${percent}% + ${y}px),0)`;

function useModalSpring({ isOpen = false, onClose = () => {} }) {
  // The react-spring style props for open and close modals
  const openStyle = useMemo(() => {
    return {
      to: modalOpenTo,
      config: modalSpringConfig,
      onRest: () => {}
    };
  }, []);
  const closeStyle = useMemo(() => {
    return {
      to: modalCloseTo,
      config: modalSpringConfig,
      onRest: onClose
    };
  }, [onClose]);

  // Create react-spring
  const [props, set] = useSpring(() => ({
    to: modalCloseTo,
    config: modalSpringConfig
  }));

  // Callback for dragging the modal vertically
  const animateDrag = useCallback(
    (my: number) => {
      set({
        to: { y: 40 + my, percent: 0 },
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
    props: { transform: to([props.y, props.percent], getTransform) },
    animateDrag,
    animateReset
  };
}

export default useModalSpring;
