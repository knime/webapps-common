import { watch, unref, onUnmounted, type Ref } from "vue";
import { onClickOutside } from "@vueuse/core";

type ClickOutsideParams = {
  // the elements whose union is the "inside" area
  targets: Ref<HTMLElement | null>[];
  // the method to be called on a click "outside" the targets
  callback: (event: PointerEvent) => void;
};

// wrapper for the vueuse onClickOutside component to only listen for clicks if active
export default (
  { targets, callback }: ClickOutsideParams,
  active: Ref<boolean>,
) => {
  let stop: (() => void) | undefined;

  const addEventListeners = () => {
    stop = onClickOutside(targets[0], callback, { ignore: targets });
  };

  const disposeEventListeners = () => {
    if (typeof stop !== "undefined") {
      stop();
    }
  };

  watch(
    () => unref(active),
    (active) => {
      if (active) {
        addEventListeners();
      } else {
        disposeEventListeners();
      }
    },
    {
      immediate: true,
    },
  );

  onUnmounted(disposeEventListeners);
};
