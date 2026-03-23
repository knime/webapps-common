import type { Children } from "#imports";

export const sortRepositoryItems = (items: Children[]) =>
  items.toSorted((a, b) => {
    // WorkflowGroups should come to the top
    if (a.type === "WorkflowGroup" && b.type !== "WorkflowGroup") {
      return -1;
    }
    if (b.type === "WorkflowGroup" && a.type !== "WorkflowGroup") {
      return 1;
    }

    return a.path < b.path ? -1 : 1;
  });
