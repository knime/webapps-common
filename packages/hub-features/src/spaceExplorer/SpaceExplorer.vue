<script lang="ts" setup>
import {
  computed,
  defineAsyncComponent,
  onMounted,
  readonly,
  ref,
  toRef,
  watch,
} from "vue";

import { FileExplorer, type FileExplorerItem } from "@knime/components";

import { getBaseName, getParentPath } from "./utils/paths";
import {
  hasDeleteCapability,
  hasRenameCapability,
  MasonCapabilities,
} from "./utils/masonControls";

import { EditSessionAvatar, useSessionsForWorkflowIds } from "./features/edit";

import { useDeleteFeature } from "./features/delete";
import { useRenameFeature } from "./features/rename";
import { useMoveOrCopyFeature } from "./features/move-copy";
import { useSpaceIcons } from "./useSpaceIcons";
import type {
  RepositoryItem,
  RepositoryItemAsMason,
  Space,
  WorkflowGroup,
} from "../api/types";

import { sortRepositoryItems } from "./utils/sortRepositoryItems";
import { $httpClient } from "../api";
import type { HubFileExplorerItem } from "./types";
import { useAsyncState } from "@vueuse/core";

const SpaceExplorerContextMenu = defineAsyncComponent(
  () => import("./SpaceExplorerContextMenu.vue"),
);

export type NavigationEvent =
  | { type: "to-parent-dir" }
  | { type: "to-child-dir"; item: RepositoryItem }
  | { type: "to-item-details"; item: RepositoryItem; openInNewTab?: boolean };

type ContextConfig = {
  isWorkflowEditingPossible: boolean;
};

type Props = {
  context: ContextConfig;
  accountId: string;
  spaceId: string;
  rootItemId: string;
  generateShortLink?: (item: { id: string }) => string;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  navigate: [payload: NavigationEvent];
}>();

// FIXME: improve fetching
const workflowGroup = ref<WorkflowGroup>();

const { state: space } = useAsyncState(
  $httpClient
    .GET("/repository/{id}", {
      params: { path: { id: props.spaceId } },
    })
    .then((r) => r.data as Space),
  null,
);

watch(
  toRef(props, "rootItemId"),
  async () => {
    // FIXME: enhance type usage if possible
    workflowGroup.value = (await $httpClient
      .GET("/repository/{id}", { params: { path: { id: props.rootItemId } } })
      .then(({ data }) => data)) as WorkflowGroup;
  },
  { immediate: true },
);

// FIXME: improve fetching

const children = computed(() =>
  sortRepositoryItems(workflowGroup.value?.children ?? []),
);

const workflowGroupChildrenById = computed(() => {
  const entries = children.value.map((item) => [item.id, item]);

  return Object.fromEntries(entries) as Record<string, RepositoryItemAsMason>;
});

// FIXME: edit sessions
// import { isTeamAccountId } from "./utils/account";

// const isTeamSpace = computed(
//   () =>
//     space.value?.ownerAccountId && isTeamAccountId(space.value?.ownerAccountId),
// );

// const visibleWorkflowIds = computed<string[]>(() => {
//   if (!workflowGroup.value) {
//     return [];
//   }

//   return children.value
//     .filter((child) => child.type === "Workflow")
//     .map(({ id }) => id);
// });

// const isWorkflowEditingPossible = computed(
//   () => props.context.isWorkflowEditingPossible,
// );

// const { getSessionByWorkflowId } = useSessionsForWorkflowIds({
//   canSubscribe: computed(() => {
//     return Boolean(isTeamSpace.value && isWorkflowEditingPossible.value);
//   }),
//   workflowIds: visibleWorkflowIds,
//   subscribeConfig: {
//     scope: space.value?.ownerAccountId ?? "",
//     filters: { spaceId: space.value?.id ?? "" },
//   },
// });
const getSessionByWorkflowId = () => {};

const activeRenameItemId = ref<string>();
const selectedItemIds = ref<string[]>([]);

const path = computed(() => workflowGroup.value?.path ?? "");

const mappedMasonControls = computed<Space["@controls"]>(() => {
  const controls = space.value?.["@controls"] ?? {};
  const result = {
    ...controls,
  };

  // we use the space controls for every item but that does not work for move
  // as you can move items but not the space
  if (hasDeleteCapability(controls)) {
    // has capability just checks for the existence of the property not the value
    result[MasonCapabilities.move] = {};
  }

  return result;
});

// rights granted to the space are also granted to any item in this space
const canDeleteItems = computed(() => {
  return hasDeleteCapability(mappedMasonControls.value ?? {});
});

const canRenameItems = computed(() => {
  return hasRenameCapability(mappedMasonControls.value ?? {});
});

const pathComponents = computed(() => {
  return path.value.split("/").filter(Boolean);
});

const isSpaceRoot = computed(() => {
  // /Users/<username>/<spacename> ==> root of space
  return pathComponents.value.length === 3; // eslint-disable-line no-magic-numbers
});

const isDirectory = ({ type }: RepositoryItemAsMason) => {
  return type === "WorkflowGroup";
};

const isOpenable = ({ type }: RepositoryItemAsMason) => {
  return !["Data", "WorkflowTemplate"].includes(type);
};

const getRepositoryItem = (item: FileExplorerItem): RepositoryItemAsMason => {
  return (item as HubFileExplorerItem).meta!.repositoryItem!;
};

const isWorkflowEditorOpen = ({ type, id }: RepositoryItemAsMason) => {
  return false;
  // const activeSession = getSessionByWorkflowId(id);
  // return (
  //   type === "Workflow" &&
  //   activeSession.state === "locked" &&
  //   activeSession.type === "EDIT_WORKFLOW"
  // );
};

const getTypeTitle = (item: FileExplorerItem) => {
  const type = getRepositoryItem(item).type;
  switch (type) {
    case "WorkflowGroup":
      return "Folder";
    case "WorkflowTemplate":
      // assumes WorkflowTemplate can only be Metanodes
      return "Metanode";
    default:
      return type;
  }
};

const fileExplorerItems = computed<HubFileExplorerItem[]>(() => {
  return children.value.map((item) => {
    const isOpen = isWorkflowEditorOpen(item);
    return {
      id: item.id,
      name: getBaseName(item.path) ?? "(unnamed)",
      isOpen,
      isDirectory: isDirectory(item),
      isOpenableFile: isOpenable(item),
      canBeRenamed: canRenameItems.value && !isOpen,
      canBeDeleted: canDeleteItems.value && !isOpen,
      meta: {
        repositoryItem: { ...item, "@controls": mappedMasonControls.value },
      },
      disabled: false,
    };
  });
});

const selectedItems = computed(() =>
  fileExplorerItems.value.filter((item) =>
    selectedItemIds.value.includes(item.id),
  ),
);

const { getSpaceItemIcon } = useSpaceIcons();
const getTypeIcon = (item: FileExplorerItem) => {
  const type = getRepositoryItem(item).type;
  return getSpaceItemIcon(type);
};

const openItem = (item: FileExplorerItem) => {
  const repositoryItem = getRepositoryItem(item);
  if (!repositoryItem) {
    return;
  }

  emit("navigate", { type: "to-item-details", item: repositoryItem });
};

const changeDirectory = (pathId: string) => {
  if (pathId === "..") {
    emit("navigate", { type: "to-parent-dir" });
    return;
  }

  const targetRepoItem = workflowGroupChildrenById.value[pathId];
  if (targetRepoItem) {
    emit("navigate", { type: "to-child-dir", item: targetRepoItem });
  }
};

const { triggerDelete } = useDeleteFeature();
const onDeleteItem = ({ items }: { items: FileExplorerItem[] }) => {
  const deleteItems = items.map((item) => ({
    id: item.id,
    type: getRepositoryItem(item).type,
    name: item.name,
  }));
  triggerDelete(deleteItems);
};

const { handleRename } = useRenameFeature({
  rootItem: computed(() => workflowGroup.value),
  currentItems: fileExplorerItems,
});

const { copyOrMoveViaDrag } = useMoveOrCopyFeature({
  space: computed(() => space.value),
  workflowGroup: computed(() => workflowGroup.value),
  workflowGroupChildrenById,
  currentItems: fileExplorerItems,
});

const getEditingUserId = (item: RepositoryItem) => {
  const sessionState = getSessionByWorkflowId(item.id);

  return sessionState.state === "locked" ? sessionState.creator : "";
};
</script>

<template>
  <div>
    <FileExplorer
      v-model:selected-item-ids="selectedItemIds"
      :items="fileExplorerItems"
      :is-root-folder="isSpaceRoot"
      :active-renamed-item-id="activeRenameItemId"
      class="space-explorer"
      :click-outside-exceptions="['[data-file-explorer-keep-selection]']"
      @open-file="openItem"
      @change-directory="changeDirectory"
      @delete-items="onDeleteItem"
      @rename-file="handleRename"
      @move-items="copyOrMoveViaDrag"
    >
      <template #itemIcon="{ item }">
        <span :title="getTypeTitle(item)">
          <Component :is="getTypeIcon(item as HubFileExplorerItem)" />
        </span>
      </template>
      <template #dynamicColumnActions="{ item }">
        <!-- avatar -->
        <!-- <EditSessionAvatar
          v-if="isWorkflowEditorOpen(getRepositoryItem(item))"
          class="item-indicator"
          :user-id="getEditingUserId(getRepositoryItem(item))"
        /> -->
      </template>
      <!-- <template
        #contextMenu="{
          anchor,
          onItemClick,
          closeContextMenu,
          createRenameOption,
          createDeleteOption,
        }"
      >
        <SpaceExplorerContextMenu
          :create-rename-option="createRenameOption"
          :create-delete-option="createDeleteOption"
          :anchor="anchor"
          :generate-short-link="generateShortLink ?? (() => '')"
          :on-item-click="onItemClick"
          :close-context-menu="closeContextMenu"
          :selected-items="selectedItems"
          :get-edit-sessions-state="getSessionByWorkflowId"
          @show-item-details="
            emit('navigate', {
              type: 'to-item-details',
              item: $event.item,
              openInNewTab: $event.openInNewTab,
            })
          "
        />
      </template> -->
    </FileExplorer>
    <!-- <ClientOnly> -->
    <!-- <DestinationPickerModal /> -->
    <!-- </ClientOnly> -->
  </div>
</template>

<style lang="postcss" scoped>
.space-explorer {
  --file-explorer-context-menu-z-index: var(--z-index-common-modal);
}

.item-indicator {
  margin: 0 0 0 auto;
  line-height: initial;
}
</style>
