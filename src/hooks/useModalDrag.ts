import { useCallback } from 'react';
import { useDrag } from 'react-use-gesture';

function useModalDrag({
  isOpen = false,
  open = () => {},
  close = () => {},
  canScrollUp = () => false,
  canScrollDown = () => false,
  onDrag = (_y: number) => {},
  onDragStart = () => {},
  onDragEnd = () => {}
}) {
  const dragHandler = useCallback(
    ({
      last,
      vxvy: [, vy],
      movement: [, my],
      memo = {
        canDragDown: !canScrollUp(),
        canDragUp: !canScrollDown(),
        isDragging: false
      },
      cancel
    }) => {
      if (!isOpen) return;

      // Expenentially slow down drag speed when dragging backwards (up)
      if (my < 0) my = my / (1 - my * 0.05);

      if (last && memo.isDragging) {
        /*
          At the end of the drag, decide if we should close the modal or keep it open.
          Velocity takes higher priority (flicking gesture).
        */
        if (vy > 0.5) {
          close();
        } else if (vy < -0.5) {
          open();
        } else if (my > 200) {
          close();
        } else {
          open();
        }

        // Callback
        onDragEnd && onDragEnd();
      } else if (
        (memo.canDragDown && vy > 0) ||
        (memo.canDragUp && vy < 0) ||
        memo.isDragging
      ) {
        /*
          Start dragging if direction is allowed (e.g. non-scrollable)
        */
        onDrag && onDrag(my);

        if (!memo.isDragging) {
          // Callback
          onDragStart && onDragStart();
          return { ...memo, isDragging: true };
        }
      } else if (!memo.isDragging && vy !== 0) {
        /*
          Drag started (y > 0) but but doesn't qualify previous conditions,
          this means the user is scrolling and not dragging.
        */
        cancel();
      }
      return memo;
    },
    [
      canScrollDown,
      canScrollUp,
      close,
      isOpen,
      onDrag,
      onDragEnd,
      onDragStart,
      open
    ]
  );

  return useDrag(dragHandler);
}

export default useModalDrag;
