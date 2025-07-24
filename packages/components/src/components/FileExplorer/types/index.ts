import type { Component } from "vue";

import type { MenuItem as BaseMenuItem } from "../../base/MenuItem/MenuItems.vue";

export type FileExplorerItem<T = Record<string, unknown>> = {
  id: string;
  name: string;
  isOpen: boolean;
  isDirectory: boolean;
  isOpenableFile: boolean;
  canBeRenamed: boolean;
  canBeDeleted: boolean;
  meta?: T;
  disabled?: boolean;
};

export type ItemIconRenderer = (item: FileExplorerItem) => Component;

type DefaultOptions = "rename" | "delete";

export type Anchor = {
  item: FileExplorerItem;
  index: number;
  element: HTMLElement;
};

export type FileExplorerMenuItem = BaseMenuItem & {
  id: DefaultOptions | Omit<string, DefaultOptions>;
};

export type CreateDefaultMenuOption = (
  item: FileExplorerItem,
  customProps?: Partial<BaseMenuItem>,
) => FileExplorerMenuItem;

export type ItemClickHandler = (menuItem: FileExplorerMenuItem) => void;

export type ItemClickPayload = {
  contextMenuItem: FileExplorerMenuItem;
  anchorItem: FileExplorerItem;
  isDelete: boolean;
  isRename: boolean;
};
