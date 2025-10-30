import {
  type MaybeElementRef,
  unrefElement,
  useEventListener,
} from "@vueuse/core";

/**
 * `onClickOutside` from Vueuse doesn't handle right click reliably.
 * This hook can be used alongside `onClickOutside` to make sure that
 * both left and right click outside are handled.
 */
const onContextMenuOutside = (
  target: MaybeElementRef,
  handler: (event: MouseEvent) => void,
) => {
  useEventListener("contextmenu", (event: MouseEvent) => {
    const element = unrefElement(target);
    if (!element) {
      return;
    }

    const eventTarget = event.target as HTMLElement;
    const clickedInside = element.contains(eventTarget);
    if (!clickedInside) {
      handler(event);
    }
  });
};

export default onContextMenuOutside;
