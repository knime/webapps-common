import { type ComputedRef, computed, nextTick, ref, watch } from "vue";

type ItemWithStatus<T extends string> = {
  status?: T;
};
type TimeoutID = ReturnType<typeof setTimeout>;

export const DEFAULT_DELAY = 10000; // delay until the panel is closed if all all items are completed

/**
 * Watches the status of the provided <code>items</code>.
 * When all <code>items</code> are in the completed state, the <code>close</code> callback is called after a configurable delay.
 * Intended to be used for the upload and download panels, which should auto-close (after the given delay) when all items are completed.
 *
 * @param items reactive array of items to be watched
 * @param completedStatus the status that determines that an item is completed
 * @param close the callback that is called on completion
 * @param delay the delay until the close callback is called
 */
export const useAutoCloseOnCompletion = <T extends string>({
  items,
  completedStatus,
  close,
  delay = DEFAULT_DELAY,
}: {
  items: ComputedRef<ItemWithStatus<T>[]>;
  completedStatus: T;
  close: () => void;
  delay?: number;
}) => {
  const allItemsCompleted = computed(
    () =>
      items.value.length &&
      items.value.filter(({ status }) => status !== completedStatus).length ===
        0,
  );

  const timeoutId = ref<TimeoutID | null>(null);

  watch(allItemsCompleted, async (newValue) => {
    if (newValue) {
      // wait a tick until UI is updated in case the delay is 0
      await nextTick();
      timeoutId.value = setTimeout(close, delay);
    } else if (timeoutId.value) {
      clearTimeout(timeoutId.value);
      timeoutId.value = null;
    }
  });
};
