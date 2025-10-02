export const filterSlotsForDynamicColumns = (slots: Record<string, unknown>) =>
  Object.fromEntries(
    Object.entries(slots).filter(([key]) => key.startsWith("dynamicColumn")),
  );
