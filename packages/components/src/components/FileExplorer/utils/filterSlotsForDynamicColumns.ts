import type { useSlots } from "vue";

export const filterSlotsForDynamicColumns = (
  slots: ReturnType<typeof useSlots>,
) =>
  Object.fromEntries(
    Object.entries(slots).filter(([key]) => key.startsWith("dynamicColumn")),
  );
