import { useCallback } from 'react';
import { useDrag } from 'react-use-gesture';

type DragOptions = {
  isOpen?: boolean;
  el?: HTMLElement | null;
  onDrag?: (my: number, vy: number) => void;
  onDragStart?: (my: number, vy: number) => void;
  onDragEnd?: (my: number, vy: number) => void;
};

function canScrollUp(el?: HTMLElement | null) {
  return el ? el.scrollTop > 0 : false;
}

function canScrollDown(el?: HTMLElement | null) {
  return el ? el.scrollTop < el.scrollHeight - el.clientHeight : false;
}

function useModalDrag({
  isOpen = false,
  el = null,
  onDrag,
  onDragStart,
  onDragEnd
}: DragOptions) {
  const dragHandler = useCallback(
    ({
      last,
      vxvy: [vx, vy],
      movement: [, my],
      memo = {
        canDragDown: !canScrollUp(el),
        canDragUp: !canScrollDown(el),
        isDragging: false
      },
      cancel
    }) => {
      if (!isOpen) return;

      // Expenentially slow down drag speed when dragging backwards (up)
      if (my < 0) my = my / (1 - my * 0.05);

      if (last && memo.isDragging) {
        onDragEnd && onDragEnd(my, vy);
      } else if (
        (memo.canDragDown && vy > 0) ||
        (memo.canDragUp && vy < 0) ||
        memo.isDragging
      ) {
        /*
          Start dragging if direction is allowed (e.g. non-scrollable)
        */
        onDrag && onDrag(my, vy);

        if (!memo.isDragging) {
          onDragStart && onDragStart(my, vy);
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
    [el, isOpen, onDrag, onDragEnd, onDragStart]
  );

  return useDrag(dragHandler);
}

export default useModalDrag;
