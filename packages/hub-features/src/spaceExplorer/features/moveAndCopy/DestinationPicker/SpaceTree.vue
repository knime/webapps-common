<script lang="ts" setup>
import {
  type AccountWithCustomData,
  type WorkflowGroupOrSpace,
  useAccountStore,
} from "#imports";
import { markRaw, nextTick, ref, useId, useTemplateRef } from "vue";
import type {
  RepositoryItem,
  Space,
} from "#shared/repositoryDefinition/catalog";
import { hasCreateCapability } from "#shared/utils/capabilities";

import {
  type BaseTreeNode,
  Tree,
  type TreeNodeOptions,
} from "@knime/virtual-tree";

import { useCatalogRepository } from "~/__shared/repository/catalogRepository";
import { getBaseName } from "~/__shared/util/repositoryPaths";
import { sortRepositoryItems } from "../sortRepositoryItems";
import { useSpaceIcons } from "../useSpaceIcons";

type SpaceTreeItem = {
  canonicalPath?: string;
  path: string;
  itemId: string;
  type: "item";
  isWriteable: boolean;
};

type GroupData = {
  id: string;
  name: string;
  type: "USER" | "TEAM";
};

type SpaceTreeGroup = {
  canonicalPath?: string;
  type: "group";
  groupData: GroupData;
};

export type SpaceTreeSelection =
  | {
      type: "item";
      itemId: string;
      canonicalPath: string;
      path: string;
      isWorkflowContainer: boolean;
      isWriteable: boolean;
    }
  | { type: "group"; canonicalPath?: string; groupData: GroupData }
  | null;

type AddToTreeCallback = (children: TreeNodeOptions[]) => void;

type Props = {
  autoExpand?: boolean;
  accounts: Array<AccountWithCustomData>;
};

const props = withDefaults(defineProps<Props>(), { autoExpand: true });

const MAX_NAME_LENGTH = 300;

const emit = defineEmits<{
  selectChange: [value: SpaceTreeSelection];
}>();

const truncate = (text: string) => {
  return text.length <= MAX_NAME_LENGTH
    ? text
    : `${text.slice(0, MAX_NAME_LENGTH)} …`;
};

const { getSpaceIcon, getSpaceGroupIcon, getSpaceItemIcon } = useSpaceIcons();

const mapSpaceItemToTree = (spaceItem: RepositoryItem) => ({
  type: "item",
  nodeKey: `item_${spaceItem.id}`,
  name: truncate(getBaseName(spaceItem.path) ?? "(unnamed)"),
  icon: markRaw(getSpaceItemIcon(spaceItem.type)),
  isWriteable: true,
  path: spaceItem.path,
  canonicalPath: spaceItem.canonicalPath,
  itemId: spaceItem.id,
  hasChildren: spaceItem.type === "WorkflowGroup",
});

const mapSpaceToTree = (space: Space): TreeNodeOptions & SpaceTreeItem => {
  const isWriteable = hasCreateCapability(space["@controls"]);
  return {
    type: "item",
    nodeKey: `space_${space.id}`,
    name: truncate(getBaseName(space.path) ?? "(unnamed)"),
    icon: markRaw(getSpaceIcon(space)),
    isWriteable,
    itemId: space.id,
    path: space.path,
    canonicalPath: space.canonicalPath,
    hasChildren: true,
  };
};

const mapSpaceGroupToTree = (
  spaceGroup: GroupData,
): TreeNodeOptions & SpaceTreeGroup => ({
  type: "group",
  nodeKey: `group_${spaceGroup.id}`,
  name: truncate(spaceGroup.name),
  hasChildren: true,
  icon: markRaw(getSpaceGroupIcon(spaceGroup)),
  groupData: spaceGroup,
});

type ExtendedTreeNodeOptions = TreeNodeOptions &
  (SpaceTreeItem | SpaceTreeGroup);

const accountStore = useAccountStore();

const typeFromAccountId = (id?: string) =>
  // eslint-disable-next-line no-magic-numbers
  id?.substring(8, 12) === "team" ? "TEAM" : "USER";

const getAccountsAsTreeItems = () => {
  const groups = props.accounts.map((userOrTeam) => ({
    id: userOrTeam?.id ?? "",
    name: userOrTeam?.name ?? "",
    type: typeFromAccountId(userOrTeam?.id),
  })) satisfies GroupData[];

  return groups.map(mapSpaceGroupToTree) ?? [];
};

const treeSource = ref(getAccountsAsTreeItems());

const tree = useTemplateRef("tree");

const autoExpandTree = () => {
  nextTick(() => {
    const [item] = treeSource.value;

    if (treeSource.value.length === 1) {
      // ... automatically expand it
      tree.value?.toggleExpand(item.nodeKey, true);
    }
  });
};

if (props.autoExpand) {
  autoExpandTree();
}

const catalogRepository = useCatalogRepository();

const loadSpaceOrWorkflowGroup = async (
  { itemId, isWriteable }: { itemId: string; isWriteable: boolean },
  addToTree: AddToTreeCallback,
) => {
  try {
    const item = (await catalogRepository.repositoryItemById({
      id: itemId,
    })) as WorkflowGroupOrSpace;

    if (!isWriteable) {
      addToTree([
        {
          nodeKey: `readonly_wf_group_${itemId}`,
          name: "Readonly space, items hidden",
          customSlot: "info",
        },
      ]);
    } else if (item.children && item.children.length > 0) {
      addToTree(
        sortRepositoryItems(item.children).map((item) =>
          mapSpaceItemToTree(item),
        ),
      );
    } else {
      addToTree([
        {
          nodeKey: `empty_wf_group_${itemId}`,
          name: "Folder is empty",
          customSlot: "info",
        },
      ]);
    }
  } catch (error) {
    consola.error("Error loading folder", error);
    addToTree([
      {
        nodeKey: `error_loadWorkflowGroup_${itemId}`,
        name: "Error loading folder",
        customSlot: "info",
      },
    ]);
  }
};

const loadSpaceGroup = async (
  { accountId }: { accountId: string },
  addToTree: AddToTreeCallback,
) => {
  try {
    await accountStore.fetch({ accountId });
    await accountStore.fetchRepositoryInfo({ accountId });
    const account = accountStore.getAccount(accountId);

    if (account.spaces && account.spaces.length > 0) {
      addToTree(account.spaces?.map((space) => mapSpaceToTree(space)));
    } else {
      addToTree([
        {
          nodeKey: `empty_space_group_${accountId}`,
          name: "Group is empty",
          customSlot: "info",
        },
      ]);
    }
  } catch (error) {
    consola.error("Error loading group", error);
    addToTree([
      {
        nodeKey: `error_loadSpaceGroup_${accountId}`,
        name: "Error loading group",
        customSlot: "info",
      },
    ]);
  }
};

const loadTreeLevel = (
  treeNode: BaseTreeNode,
  addToTree: AddToTreeCallback,
) => {
  const treeNodeOptions = treeNode.origin as ExtendedTreeNodeOptions;

  if (treeNodeOptions.type === "group") {
    const { groupData } = treeNodeOptions;
    loadSpaceGroup({ accountId: groupData.id }, addToTree);
    return;
  }

  if (treeNodeOptions.type === "item") {
    const { itemId, isWriteable } = treeNodeOptions;
    loadSpaceOrWorkflowGroup({ itemId, isWriteable }, addToTree);
    return;
  }

  const id = `${useId()}_${treeNode.origin.nodeKey.toString()}`;

  addToTree([
    {
      nodeKey: `error_loadWorkflowGroup_${treeNode.name}_${id}`,
      name: "Error loading contents",
      customSlot: "info",
    },
  ]);
};

const onSelectChange = ({ node }: { node: BaseTreeNode | undefined }) => {
  if (!node) {
    emit("selectChange", null);
    return;
  }

  const treeNodeOptions = node.origin as ExtendedTreeNodeOptions;

  if (treeNodeOptions.type === "item") {
    const {
      type,
      itemId,
      canonicalPath = "",
      path,
      hasChildren,
      isWriteable,
    } = treeNodeOptions;

    emit("selectChange", {
      type,
      itemId,
      canonicalPath,
      path,
      isWorkflowContainer: hasChildren!,
      isWriteable,
    });
    return;
  }

  if (treeNodeOptions.type === "group") {
    const { type, canonicalPath, groupData } = treeNodeOptions;
    emit("selectChange", { type, canonicalPath, groupData });
    return;
  }

  emit("selectChange", null);
};
</script>

<template>
  <Tree
    ref="tree"
    :source="treeSource"
    :load-data="loadTreeLevel"
    @select-change="onSelectChange"
  >
    <template #info="{ treeNode }: { treeNode: BaseTreeNode }">
      <span class="info-node">({{ treeNode.name }})</span>
    </template>
  </Tree>
</template>

<style lang="postcss" scoped>
.info-node {
  font-style: italic;
  color: var(--knime-gray-dark);
  pointer-events: none;
}

.retry-button.button.compact.with-border {
  display: flex;
  place-content: center center;
  height: 20px;
  padding: 0;
  line-height: 20px;
}
</style>
