import type { FunctionalComponent, SVGAttributes } from "vue";
import type { MenuItem as BaseMenuItem } from "webapps-common/ui/components/MenuItems.vue";

export type FileExplorerItem<T = Record<string, any>> = {
  id: string;
  name: string;
  isOpen: boolean;
  isDirectory: boolean;
  isOpenableFile: boolean;
  canBeRenamed: boolean;
  canBeDeleted: boolean;
  meta?: T;
};

export type ItemIconRenderer = (
  item: FileExplorerItem
) => FunctionalComponent<SVGAttributes>;

export namespace FileExplorerContextMenu {
  type DefaultOptions = "rename" | "delete";

  export type Anchor = {
    item: FileExplorerItem;
    index: number;
    element: HTMLElement;
  };

  export type MenuItem = BaseMenuItem & {
    id: DefaultOptions | Omit<string, DefaultOptions>;
  };

  export type CreateDefaultMenuOption = (
    item: FileExplorerItem,
    customProps?: Partial<BaseMenuItem>
  ) => MenuItem;

  export type ItemClickPayload = {
    contextMenuItem: MenuItem;
    anchorItem: FileExplorerItem;
    isDelete: boolean;
    isRename: boolean;
  };
}
