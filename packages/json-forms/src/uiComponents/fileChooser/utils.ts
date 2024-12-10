import type { FileExplorerItem } from "@knime/components";

import type { Item } from "./types";

export const toFileExplorerItem = (props: Item): FileExplorerItem => {
  return {
    isDirectory: props.isDirectory,
    id: props.name,
    name: props.name,
    isOpen: false,
    isOpenableFile: true,
    canBeRenamed: false,
    canBeDeleted: false,
  };
};
