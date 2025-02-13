import { onBeforeUnmount, onMounted } from "vue";

type UseBeforeUnloadOptions = {
  /**
   * Predicate function which will be fired when the BeforeUnload event triggers.
   * @returns whether the BeforeUnload event should be prevented or not
   */
  hasUnsavedChanges: () => boolean;
};

/**
 * This composable ensures that page navigation is halted
 * if there are unsaved changes present.
 *
 * Note that it will only account for the page's `UnloadEvent`.
 * It will not take client-side navigation (such as Vue Router or Nuxt Routing)
 * into account
 */
export const useBeforeUnload = (options: UseBeforeUnloadOptions) => {
  const { hasUnsavedChanges } = options;

  const onBeforeUnloadUnsavedChanges = (event: BeforeUnloadEvent) => {
    if (hasUnsavedChanges()) {
      event.preventDefault();
    }
  };

  onMounted(() => {
    window.addEventListener("beforeunload", onBeforeUnloadUnsavedChanges);
  });

  onBeforeUnmount(() => {
    window.removeEventListener("beforeunload", onBeforeUnloadUnsavedChanges);
  });
};
