import React, { useCallback, useEffect, useState } from 'react';
import { animated } from 'react-spring';
import { Backdrop, Modal } from '@material-ui/core';
import ModalCard from 'components/base/ModalCard';
import useModalSpring from 'hooks/useModalSpring';
import useModalDrag from 'hooks/useModalDrag';

const AnimatedModalCard = animated(ModalCard);

function SlideModal({
  open,
  onClose = () => {},
  preventClose = false,
  children
}: React.PropsWithChildren<{
  open: boolean;
  onClose?: () => void;
  preventClose?: boolean;
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

  const handleDragStart = useCallback(() => {
    if (contentRef && contentRef.scrollTop <= 0) {
      contentRef.style.overflow = 'hidden';
    }
  }, [contentRef]);

  const handleDragEnd = useCallback(
    (my: number, vy: number) => {
      if (contentRef) {
        if (vy > 0.5) {
          onClose();
        } else if (vy < -0.5) {
          animateReset();
        } else if (my > 200) {
          onClose();
        } else {
          animateReset();
        }
        contentRef.style.overflow = '';
      }
    },
    [animateReset, contentRef, onClose]
  );

  const contentBind = useModalDrag({
    el: contentRef,
    isOpen: modalOpen,
    onDrag: animateDrag,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd
  });

  const headerBind = useModalDrag({
    el: contentRef,
    isOpen: modalOpen,
    onDrag: animateDrag,
    onDragStart: handleDragStart,
    onDragEnd: handleDragEnd
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
        data-testid="slide-modal-card"
        headerProps={headerBind()}
        style={props}
      >
        {children}
      </AnimatedModalCard>
    </Modal>
  );
}

export default SlideModal;
