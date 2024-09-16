<!-- eslint-disable no-undefined -->
<script setup lang="ts">
import { type PropType, computed, inject } from "vue";
import VirCheckBox from "./TreeNodeCheckbox.vue";
import RenderNode from "./renderNode";
import renderIcon from "./renderIcon";
import { BaseTreeNode } from "./baseTreeNode";
import type { EventParams, NodeKey } from "./types";
import { TreeInjectionKey } from "./context";

const props = defineProps({
  node: {
    type: Object as PropType<BaseTreeNode>,
    required: true,
  },
  selectedKeys: {
    type: Object as PropType<Set<NodeKey>>,
    required: true,
  },
  // eslint-disable-next-line vue/require-default-prop
  focusKey: {
    type: [String, Number] as PropType<NodeKey>,
  },
  expandedKeys: {
    type: Object as PropType<Set<NodeKey>>,
    required: true,
  },
  disabledKeys: {
    type: Object as PropType<Set<NodeKey>>,
    required: true,
  },
  checkedKeys: {
    type: Set as PropType<Set<NodeKey>>,
    required: true,
  },
  halfCheckedKeys: {
    type: Set as PropType<Set<NodeKey>>,
    required: true,
  },
  showCheckbox: {
    type: Boolean,
    default: false,
  },
});

const showArrow = computed(() => props.node.hasChildren);
const showCheckbox = computed(() => {
  if (props.node.showCheckbox !== undefined) {
    return props.node.showCheckbox;
  }
  return props.showCheckbox;
});
// console.log('showCheckbox', showCheckbox.value);

const emit = defineEmits<{
  (e: "selectChange", value: BaseTreeNode): void;
  (e: "checkChange", value: BaseTreeNode): void;
  (e: "toggleExpand", value: EventParams): void;
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
  // console.log('handleExpand', showArrow)
  if (showArrow.value) {
    emit("toggleExpand", {
      state: !treeContext.expandedKeys.has(props.node.key),
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
        props.expandedKeys.has(props.node.key) ? 'expanded' : '',
      ]"
      @click="arrowClick"
    >
      <render-icon v-if="showArrow" :context="treeContext" :node="props.node" />
    </div>
    <vir-check-box
      v-if="showCheckbox"
      class="node-content node-check-box"
      :disabled="props.disabledKeys.has(props.node.key)"
      :model-value="props.checkedKeys.has(props.node.key)"
      :half-checked="props.halfCheckedKeys.has(props.node.key)"
      @change="handleCheckChange"
    >
      <render-node
        :title-cls="titleCls"
        :context="treeContext"
        :node="props.node"
      />
    </vir-check-box>
    <div v-else class="node-content node-text" @click="handleSelect">
      <render-node
        :title-cls="titleCls"
        :context="treeContext"
        :node="props.node"
      />
    </div>
  </div>
</template>
