<!-- eslint-disable no-undefined -->
<script setup lang="ts">
import { computed, inject } from "vue";

import TreeNodeCheckbox from "./TreeNodeCheckbox.vue";
import { BaseTreeNode } from "./baseTreeNode";
import { TreeInjectionKey } from "./context";
import RenderIcon from "./renderIcon";
import RenderNode from "./renderNode";
import type { EventParams, NodeKey } from "./types";

type Props = {
  node: BaseTreeNode;
  selectedKeys: Set<NodeKey>;
  expandedKeys: Set<NodeKey>;
  disabledKeys: Set<NodeKey>;
  checkedKeys: Set<NodeKey>;
  halfCheckedKeys: Set<NodeKey>;
  showCheckbox: boolean;
  focusKey?: NodeKey;
};

const props = defineProps<Props>();

const showArrow = computed(() => props.node.hasChildren);
const showCheckbox = computed(() => {
  if (props.node.showCheckbox !== undefined) {
    return props.node.showCheckbox;
  }
  return props.showCheckbox;
});

const emit = defineEmits<{
  selectChange: [value: BaseTreeNode];
  checkChange: [value: BaseTreeNode];
  toggleExpand: [value: EventParams];
}>();

const treeContext = inject(TreeInjectionKey)!;

const treeNodeStyle = computed(() => ({
  "--vir-tree-level": props.node.level,
}));

const titleCls = computed(() => {
  let result = "node-title";
  if (props.focusKey === props.node.key) {
    result += " focused";
  }
  if (props.selectedKeys.has(props.node.key)) {
    result += " selected";
  }
  if (props.disabledKeys.has(props.node.key)) {
    result += " disabled";
  }
  return result;
});

const handleSelect = (event: MouseEvent) => {
  event.stopPropagation();
  if (!props.disabledKeys.has(props.node.key)) {
    emit("selectChange", props.node);
  }
};

const handleCheckChange = () => {
  emit("checkChange", props.node);
};

const handleExpand = () => {
  if (showArrow.value) {
    const state = !treeContext.getExpandedKeys().includes(props.node.key);
    emit("toggleExpand", {
      state,
      node: props.node,
    });
  }
};

const arrowClick = (event: MouseEvent) => {
  event.stopPropagation();
  handleExpand();
};
</script>

<template>
  <div class="vir-tree-node" :style="treeNodeStyle" @click="handleExpand">
    <div
      :class="[
        'node-arrow',
        props.node.loading ? 'loading' : '',
        props.expandedKeys.has(props.node.key) ? 'expanded' : '',
      ]"
      @click="arrowClick"
    >
      <RenderIcon v-if="showArrow" :context="treeContext" :node="props.node" />
    </div>
    <TreeNodeCheckbox
      v-if="showCheckbox"
      class="node-content node-check-box"
      :disabled="props.disabledKeys.has(props.node.key)"
      :model-value="props.checkedKeys.has(props.node.key)"
      :half-checked="props.halfCheckedKeys.has(props.node.key)"
      @change="handleCheckChange"
    >
      <RenderNode
        :title-cls="titleCls"
        :context="treeContext"
        :node="props.node"
      />
    </TreeNodeCheckbox>
    <div v-else class="node-content node-text" @click="handleSelect">
      <RenderNode
        :title-cls="titleCls"
        :context="treeContext"
        :node="props.node"
      />
    </div>
  </div>
</template>
