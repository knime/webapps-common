import type { FileExplorerItem } from "@knime/components";

import type { RepositoryItemAsMason } from "../api/types";

export type HubFileExplorerItem = FileExplorerItem<{
  repositoryItem?: RepositoryItemAsMason;
}>;
