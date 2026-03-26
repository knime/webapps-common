import type { FileExplorerItem, MenuItem } from "@knime/components";

import type { RepositoryItemAsMason } from "../api/types";

export type HubFileExplorerItem = FileExplorerItem<{
  repositoryItem: RepositoryItemAsMason;
}>;

export type MenuItemWithHandler = { id: string } & MenuItem<{
  // FIXME: needed?
  // show?: boolean;
  handler?: (event?: MouseEvent) => void;
}>;
