<script lang="ts" setup>
import { computed } from "vue";
import type {
  RepositoryItem,
  Workflow,
} from "#shared/repositoryDefinition/catalog";

import {
  type Anchor,
  type CreateDefaultMenuOption,
  type MenuItem,
  MenuItems,
} from "@knime/components";
import ArrowNext from "@knime/styles/img/icons/circle-arrow-right.svg";
import CopyIcon from "@knime/styles/img/icons/copy.svg";
import MoveIcon from "@knime/styles/img/icons/move-from-space-to-space.svg";
import RenameIcon from "@knime/styles/img/icons/rename.svg";
import TrashIcon from "@knime/styles/img/icons/trash.svg";
import { getMetaOrCtrlKey, hotkeys } from "@knime/utils";

import { menuGroupsBuilder } from "~/__shared/util/menuGroupsBuilder";
import { valueOrEmpty } from "~/__shared/util/valueOrEmpty";
import {
  type MenuItemWithHandler,
  useContextMenuHandlers,
  useCopyShortLinkMenuItem,
  useDownloadMenuItem,
  useEditWorkflowMenuItem,
} from "~/composables/contextMenu";
import type { EditSession } from "~/composables/workflowEditing/useWorkflowEditingSessions";

import type { HubFileExplorerItem } from "./SpaceExplorer.vue";
import { useMoveOrCopyOperations } from "./useMoveOrCopyOperations";

const requiresLogin = ["Space", "WorkflowGroup"];
const downloadBlacklist = ["Component", "WorkflowTemplate"];

type Props = {
  anchor: Anchor;
  onItemClick: (item: MenuItem) => void;
  closeContextMenu: () => void;
  createRenameOption: CreateDefaultMenuOption;
  createDeleteOption: CreateDefaultMenuOption;
  selectedItems: HubFileExplorerItem[];
  getEditSessionsState: (workflowId: string) => EditSession;
  generateShortLink: (item: { id: string }) => string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  showItemDetails: [{ item: RepositoryItem; openInNewTab: boolean }];
}>();

const getRepositoryItem = (item: HubFileExplorerItem) =>
  item.meta!.repositoryItem as RepositoryItem;
const anchorRepositoryItem = computed(() =>
  getRepositoryItem(props.anchor.item),
);

const isWorkflow = (item: RepositoryItem): item is Workflow =>
  item.type === "Workflow";

const isDownloadable = (item: RepositoryItem) => {
  return !downloadBlacklist.includes(item.type);
};

const showDetails = computed<MenuItemWithHandler>(() => {
  const isFolder = anchorRepositoryItem.value.type === "WorkflowGroup";
  return {
    id: "showDetails",
    text: isFolder ? "Open folder" : "Show details",
    icon: ArrowNext,
    metadata: {
      handler: (event?: MouseEvent) => {
        emit("showItemDetails", {
          item: anchorRepositoryItem.value,
          openInNewTab: Boolean(event?.[getMetaOrCtrlKey()]),
        });
      },
    },
  };
});

const workflowItem = computed(() => {
  if (!isWorkflow(anchorRepositoryItem.value)) {
    // return a dummy workflow that will never produce an editing session
    return { id: "" } as Workflow;
  }

  return anchorRepositoryItem.value;
});

const { menuItem: editWorkflow, isVisible } = useEditWorkflowMenuItem({
  workflowId: computed(() => workflowItem.value.id),
  masonControls: computed(() => workflowItem.value),
  getEditSessionsState: props.getEditSessionsState,
});

const copyShortlink = useCopyShortLinkMenuItem({
  itemId: anchorRepositoryItem.value.id,
  itemType: anchorRepositoryItem.value.type,
  generateShortLink: props.generateShortLink,
});

const download = useDownloadMenuItem<HubFileExplorerItem>({
  selectedItems: computed(() => props.selectedItems),
  isDownloadable: (item) => isDownloadable(item.meta!.repositoryItem!),
  requiresLogin: (item) =>
    requiresLogin.includes(item.meta!.repositoryItem!.type),
});

const deleteItem = computed<MenuItem>(() =>
  props.createDeleteOption(props.anchor.item, {
    text: "Move to trash",
    icon: TrashIcon,
    hotkeyText: hotkeys.formatHotkeys(["Delete"]),
  }),
);

const renameItem = computed<MenuItem>(() =>
  props.createRenameOption(props.anchor.item, {
    text: "Rename",
    icon: RenameIcon,
    hotkeyText: hotkeys.formatHotkeys(["F2"]),
  }),
);

const { canCopyItems, canMoveItems, copyOrMoveAskForDestination } =
  useMoveOrCopyOperations({
    masonControls: computed(() => anchorRepositoryItem.value["@controls"]),
  });

const moveItems = computed<MenuItemWithHandler>(() => {
  return {
    id: "move",
    text: "Move to…",
    icon: MoveIcon,
    metadata: {
      handler: async () => {
        await copyOrMoveAskForDestination("move", props.selectedItems);
      },
    },
  };
});

const copyItems = computed<MenuItemWithHandler>(() => {
  return {
    id: "copy",
    text: "Copy to…",
    icon: CopyIcon,
    metadata: {
      handler: async () => {
        await copyOrMoveAskForDestination("copy", props.selectedItems);
      },
    },
  };
});

const spaceExplorerContextMenuItems = computed(() => {
  const menuItems = menuGroupsBuilder<MenuItem>({
    removeDisabledItems: false,
  })
    .append([
      ...valueOrEmpty(
        props.selectedItems.length === 1 && props.anchor.item.isOpenableFile,
        showDetails.value,
      ),
      ...valueOrEmpty(copyShortlink.isVisible.value, copyShortlink.menuItem),
    ])
    .append([
      ...valueOrEmpty(
        isVisible.value &&
          props.selectedItems.length === 1 &&
          isWorkflow(anchorRepositoryItem.value),
        editWorkflow.value,
      ),
    ])
    .append([
      ...valueOrEmpty(
        props.selectedItems.length === 1 && props.anchor.item.canBeRenamed,
        renameItem.value,
      ),
      ...valueOrEmpty(
        props.selectedItems.every((item) => item.canBeDeleted),
        deleteItem.value,
      ),
    ])
    .append([
      ...valueOrEmpty(canMoveItems.value, moveItems.value),
      ...valueOrEmpty(canCopyItems.value, copyItems.value),
    ])
    .append([
      ...valueOrEmpty(
        props.selectedItems.every((item) =>
          isDownloadable(item.meta!.repositoryItem!),
        ),
        download.menuItem,
      ),
    ])
    .build();

  return menuItems;
});

const { handleItemClick } = useContextMenuHandlers({
  closeContextMenu: props.closeContextMenu,
  onItemClick: props.onItemClick,
});
</script>

<template>
  <MenuItems
    id="repository-explorer-context-menu"
    :items="spaceExplorerContextMenuItems"
    class="menu-items"
    register-keydown
    menu-aria-label="Repository Explorer Context Menu"
    @item-click="
      (event, item) => handleItemClick(item as MenuItemWithHandler, event)
    "
    @close="closeContextMenu"
  />
</template>
