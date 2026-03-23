import type { components } from "./schema/schema";

// TODO
export type WorkflowGroup = components["schemas"]["WorkflowGroup"];

export type RepositoryItem = components["schemas"]["RepositoryItem"];
export type RepositoryItemAsMason =
  components["schemas"]["RepositoryItemAsMason"];

export type Space = Omit<
  components["schemas"]["Space"],
  "_class" | "children" | "updateCheckCount" | "updateCount"
>;
