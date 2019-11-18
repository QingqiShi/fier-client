import React, { useCallback, useEffect, useState } from 'react';
import { animated } from 'react-spring';
import { Backdrop, Modal } from '@material-ui/core';
import ModalCard from 'components/base/ModalCard';
import useModalSpring from 'hooks/useModalSpring';
import useModalDrag from 'hooks/useModalDrag';

const AnimatedModalCard = animated(ModalCard);

function SlideModal({
  open,
  onClose,
  children
}: React.PropsWithChildren<{
  open: boolean;
  onClose: () => void;
  title?: string;
}>) {
  const [modalOpen, setModalOpen] = useState(open);

  useEffect(() => {
    if (open && !modalOpen) {
      setModalOpen(true);
    }
  }, [modalOpen, open]);

  const [contentRef, setContentRef] = useState<HTMLElement | null>(null);

  const { props, animateDrag, animateReset } = useModalSpring({
    isOpen: open,
    onClose: useCallback(() => {
      setModalOpen(false);
    }, [])
  });

  const contentBind = useModalDrag({
    isOpen: modalOpen,
    open: animateReset,
    close: onClose,
    canScrollUp: useCallback(
      () => (contentRef ? contentRef.scrollTop > 0 : false),
      [contentRef]
    ),
    canScrollDown: useCallback(
      () =>
        contentRef
          ? contentRef.scrollTop <
            contentRef.scrollHeight - contentRef.clientHeight
          : false,
      [contentRef]
    ),
    onDrag: animateDrag,
    onDragStart: useCallback(() => {
      if (contentRef && contentRef.scrollTop <= 0) {
        contentRef.style.overflow = 'hidden';
      }
    }, [contentRef]),
    onDragEnd: useCallback(() => {
      if (contentRef) {
        contentRef.style.overflow = '';
      }
    }, [contentRef])
  });

  const headerBind = useModalDrag({
    isOpen: modalOpen,
    open: animateReset,
    close: onClose,
    onDrag: animateDrag,
    onDragStart: () => {
      if (contentRef && contentRef.scrollTop <= 0) {
        contentRef.style.overflow = 'hidden';
      }
    },
    onDragEnd: () => {
      if (contentRef) {
        contentRef.style.overflow = '';
      }
    }
  });

  return (
    <Modal
      BackdropComponent={Backdrop}
      BackdropProps={{
        open: open,
        timeout: 500
      }}
      open={modalOpen}
      onClose={onClose}
    >
      <AnimatedModalCard
        contentProps={contentBind()}
        contentRef={setContentRef}
        headerProps={headerBind()}
        style={props}
      >
        {children}
      </AnimatedModalCard>
    </Modal>
  );
}

export default SlideModal;
