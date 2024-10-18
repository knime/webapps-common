<script lang="ts" setup>
/**
 * Thin wrapper around the tree library with added KNIME styles and UX.
 */
import { nextTick, ref } from "vue";

import { LoadingIcon, useKeyPressedUntilMouseClick } from "@knime/components";
import ArrowNextIcon from "@knime/styles/img/icons/arrow-next.svg";

import BaseTree, { type EventParams } from "../baseTree";
import {
  type BaseTreeNode,
  type KeydownEvent,
  type LoadDataFunc,
  type NodeKey,
  type SelectEventParams,
  type TreeNodeOptions,
} from "../types";

interface Props {
  source: TreeNodeOptions[];
  loadData?: LoadDataFunc;
  selectable?: boolean;
  expandedKeys?: string[];
  idPrefix?: string;
  virtual?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  // eslint-disable-next-line no-undefined
  loadData: undefined,
  selectable: true,
  expandedKeys: () => [],
  idPrefix: "tree",
  virtual: false,
});

const emit = defineEmits<{
  keydown: [value: KeydownEvent];
  selectChange: [value: SelectEventParams];
  expandChange: [value: EventParams];
}>();

const baseTree = ref<InstanceType<typeof BaseTree>>();

const focusedNodeKey = ref<NodeKey | null>();

const isTreeNodeSelected = (treeNode: BaseTreeNode) => {
  return (
    props.selectable && baseTree.value?.getSelectedNode()?.key === treeNode.key
  );
};

const selectedKey = ref<string>();

const keyPressedUntilMouseClick = useKeyPressedUntilMouseClick();

const onFocusChange = async ({ node }: { node: BaseTreeNode | null }) => {
  focusedNodeKey.value = node?.key ?? null;

  // change selection to focused element if items are selectable
  if (props.selectable && focusedNodeKey.value) {
    selectedKey.value = focusedNodeKey.value?.toString();
  }

  // scroll into view if we are using the keyboard to navigate
  if (!keyPressedUntilMouseClick.value) {
    return;
  }
  await nextTick();
  const element = baseTree.value?.$el.querySelector(".tree-node-wrapper.focus");
  element?.scrollIntoView({
    behavior: "smooth",
    block: "nearest",
  });
};

const onTreeKeydown = ({ event, node }: KeydownEvent) => {
  const { key } = event;

  const toggleExpand = () => {
    event.stopPropagation();
    event.preventDefault();
    if (node.origin.hasChildren) {
      baseTree.value!.toggleExpand(node.key);
    }
  };

  if (key === "Enter") {
    toggleExpand();
  }

  emit("keydown", { event, node });
};

const domNodeId = (key?: NodeKey | null) =>
  // eslint-disable-next-line no-undefined
  key ? `${props.idPrefix}_${key}` : undefined;

const hasFocus = (treeNode: BaseTreeNode) => {
  const keysMatch = focusedNodeKey.value === treeNode.key;

  return keysMatch && keyPressedUntilMouseClick.value;
};

const onExpandableClick = (node: BaseTreeNode) => {
  baseTree.value?.toggleExpand(node.key);
};

const isTreeNodeExpandable = (node: BaseTreeNode) => {
  return node.origin.hasChildren || node.origin.children;
};

const onSelectChange = ({ node, preSelectedNode }: SelectEventParams) => {
  // do not forward event for non selectable trees
  if (!props.selectable) {
    return;
  }

  emit("selectChange", { node, preSelectedNode });
};

defineExpose({
  getExpandedKeys: () => baseTree.value?.getExpandedKeys(),
  toggleExpand: (nodeKey: NodeKey, state?: boolean) =>
    baseTree.value?.toggleExpand(nodeKey, state),
  getSelectedTreeNode: () =>
    // eslint-disable-next-line no-undefined
    props.selectable ? baseTree.value?.getSelectedNode() : undefined,
  /** trigger loadData function (prop) to load the children of the given nodeKey. Does not remove current children. */
  loadChildren: (nodeKey: NodeKey) => baseTree.value?.loadChildren(nodeKey),
  /** remove all children of a given nodeKey. */
  clearChildren: (nodeKey: NodeKey) => baseTree.value?.clearChildren(nodeKey),
});
</script>

<template>
  <BaseTree
    ref="baseTree"
    class="virtual-tree"
    :source="source"
    :load-data="loadData"
    disable-deselect
    :default-selected-key="selectedKey"
    :default-expanded-keys="expandedKeys"
    :aria-activedescendant="domNodeId(focusedNodeKey)"
    :virtual="virtual"
    @keydown="onTreeKeydown"
    @focus-change="onFocusChange"
    @select-change="onSelectChange"
    @expand-change="$emit('expandChange', $event)"
  >
    <template #node="{ node }: { node: BaseTreeNode }">
      <span
        :id="domNodeId(node.key)"
        :class="['tree-node-wrapper', { focus: hasFocus(node) }]"
      >
        <template v-if="isTreeNodeExpandable(node)">
          <span
            :class="[
              'tree-node',
              'expandable',
              {
                selected: isTreeNodeSelected(node),
                focus: hasFocus(node),
              },
            ]"
            @click="() => onExpandableClick(node)"
            ><slot :name="node.customSlot ?? 'expandable'" :tree-node="node"
              ><Component :is="node.icon" v-if="node.icon" />
              {{ node.name }}</slot
            ></span
          >
        </template>
        <template v-else>
          <span
            :class="[
              'tree-node',
              'leaf',
              { selected: isTreeNodeSelected(node), focus: hasFocus(node) },
            ]"
            ><slot :name="node.customSlot ?? 'leaf'" :tree-node="node"
              ><Component :is="node.icon" v-if="node.icon" />
              {{ node.name }}</slot
            ></span
          >
        </template>
      </span>
    </template>
    <template #icon="slotProps">
      <slot name="icon" v-bind="slotProps">
        <LoadingIcon v-if="slotProps.loading" class="loading-icon" />
        <ArrowNextIcon v-else class="icon" />
      </slot>
    </template>
  </BaseTree>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.tree-node-wrapper {
  display: block;
  width: 100%;
}

.tree-node {
  display: flex;
  align-items: center;
  gap: var(--space-4);
  width: 100%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;

  & svg {
    stroke: var(--knime-masala);

    @mixin svg-icon-size 16;
  }
}

.expandable {
  font-weight: 700;
}

.virtual-tree {
  /** required for the focus/selection outline */
  padding-top: 1px;

  --vir-tree-indent: var(--space-24);

  &:focus {
    outline: none;
  }
}

/* selected and focus styles */
:deep(.vir-tree-node:has(.tree-node.selected)) {
  color: var(--knime-cornflower-dark);
  background-color: var(--knime-cornflower-semi);
}

.virtual-tree :deep(.vir-tree-node:has(.tree-node.focus)) {
  outline: 1px solid var(--knime-cornflower);
  border-radius: 2px;
}
</style>

<style lang="css">
/** inlined virtual tree styles with KNIME modifications */
/* stylelint-disable */
.vir-tree .vue-recycle-scroller {
  position: relative;
}
.vir-tree .vue-recycle-scroller.direction-vertical:not(.page-mode) {
  overflow-y: auto;
}
.vir-tree .vue-recycle-scroller.direction-horizontal:not(.page-mode) {
  overflow-x: auto;
}
.vir-tree .vue-recycle-scroller.direction-horizontal {
  display: flex;
}
.vir-tree .vue-recycle-scroller__slot {
  flex: auto 0 0;
}
.vir-tree .vue-recycle-scroller__item-wrapper {
  flex: 1;
  box-sizing: border-box;
  overflow: hidden;
  position: relative;
}
.vir-tree .vue-recycle-scroller.ready .vue-recycle-scroller__item-view {
  position: absolute;
  top: 0;
  left: 0;
  will-change: transform;
}
.vir-tree
  .vue-recycle-scroller.direction-vertical
  .vue-recycle-scroller__item-wrapper {
  width: 100%;
}
.vir-tree
  .vue-recycle-scroller.direction-horizontal
  .vue-recycle-scroller__item-wrapper {
  height: 100%;
}
.vir-tree
  .vue-recycle-scroller.ready.direction-vertical
  .vue-recycle-scroller__item-view {
  width: 100%;
}
.vir-tree
  .vue-recycle-scroller.ready.direction-horizontal
  .vue-recycle-scroller__item-view {
  height: 100%;
}
.vir-tree .resize-observer {
  position: absolute;
  top: 0;
  left: 0;
  z-index: -1;
  width: 100%;
  height: 100%;
  border: none;
  background-color: transparent;
  pointer-events: none;
  display: block;
  overflow: hidden;
  opacity: 0;
}
.vir-tree .resize-observer object {
  display: block;
  position: absolute;
  top: 0;
  left: 0;
  height: 100%;
  width: 100%;
  overflow: hidden;
  pointer-events: none;
  z-index: -1;
}
.vir-tree {
  --white-color: var(--knime-white);
  --border-color: var(--knime-dove-gray);
  --primary-color: var(--knime-cornflower);
  --assist-color: var(--knime-aquamarine);
  --disable-color: var(--knime-stone-dark);
  --text-color: var(--knime-masala);
  --gray-color-tree: var(--knime-silver-sand-semi);
  --font-size-base: 13px;
}

.vir-checkbox {
  display: inline-block;
  cursor: pointer;
  user-select: none;
}
.vir-checkbox .inner {
  display: inline-block;
  vertical-align: text-bottom;
  position: relative;
  width: 16px;
  height: 16px;
  direction: ltr;
  background-color: var(--white-color);
  border: 1px solid var(--border-color);
  border-radius: 2px;
  border-collapse: initial;
  box-sizing: border-box;
}
.vir-checkbox .inner:after {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 4px;
  height: 8px;
  margin-left: -2px;
  margin-top: -5px;
  border: 2px solid var(--white-color);
  border-top: 0;
  border-left: 0;
  content: " ";
  opacity: 0;
}
.vir-checkbox .content {
  display: inline-block;
  margin-left: 4px;
}
.vir-checkbox.half-checked .inner:after {
  top: 50%;
  left: 50%;
  width: 10px;
  height: 10px;
  background-color: var(--primary-color);
  border: none;
  margin: 0;
  transform: translate(-50%, -50%);
  opacity: 1;
  content: " ";
}
.vir-checkbox.checked .inner {
  border-color: var(--primary-color);
  background-color: var(--primary-color);
}
.vir-checkbox.checked .inner:after {
  transform: rotate(45deg);
  opacity: 1;
}
.vir-checkbox.disabled {
  color: var(--disabled-color);
  cursor: not-allowed;
}
.vir-checkbox.disabled .inner {
  border-color: var(--disable-color);
  background-color: var(--disable-color);
}
.vir-tree {
  position: relative;
  display: block;
  width: 100%;
  user-select: none;
}
.vir-tree-node {
  /* indent */
  padding-left: calc(var(--vir-tree-level, 0) * var(--vir-tree-indent));
  display: grid;
  grid-template-columns: 20px auto;
  gap: var(--space-4);
  font-size: var(--font-size-base);
  cursor: pointer;
  height: 24px;
  line-height: 24px;
}
.vir-tree-node:hover {
  background-color: var(--gray-color-tree);
}
.vir-tree-node:hover .node-content .node-title {
  color: var(--primary-color);
}
.vir-tree-node .node-arrow {
  display: flex;
  align-items: center;
  cursor: pointer;
  transition: transform 0.3s ease;
}

.vir-tree-node .node-arrow svg {
  height: 16px;
  width: 16px;
  stroke-width: 2px;
}

.vir-tree-node .node-arrow:empty {
  display: none;
}
.vir-tree-node:has(.node-arrow:empty) {
  grid-template-columns: 1fr;
}
.vir-tree-node .node-arrow.expanded {
  transform: rotate(90deg);
}
.vir-tree-node .node-content {
  display: flex;
  align-items: center;
  width: 100%;
  max-width: 100%;
  overflow: hidden;
}
.vir-tree-node .node-content .node-title {
  padding: 0 6px;
  vertical-align: top;
  color: var(--text-color);
  white-space: nowrap;
}
.vir-tree-node .node-content .node-title.selected {
  background-color: var(--assist-color);
}
.vir-tree-node .node-content .node-title.disabled {
  cursor: not-allowed;
  color: var(--disable-color);
}
.node-selected .node-title {
  background-color: var(--assist-color);
}
/* stylelint-enable */
</style>
