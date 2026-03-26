import type { components } from "./schema/schema";

export type WorkflowGroup = components["schemas"]["WorkflowGroup"];

// FIXME: double check accuracy of this type
export type Workflow = Omit<
  components["schemas"]["AggregatedWorkflow"],
  "type"
> & { type: "Workflow" };

export type RepositoryItem = components["schemas"]["RepositoryItem"];
export type RepositoryItemAsMason =
  components["schemas"]["RepositoryItemAsMason"];

export type Space = Omit<
  components["schemas"]["Space"],
  "_class" | "children" | "updateCheckCount" | "updateCount"
>;
