<script setup lang="ts">
import { markRaw, ref } from "vue";

import FileIcon from "@knime/styles/img/icons/file.svg";
import AppleIcon from "@knime/styles/img/icons/os-apple.svg";
import {
  type BaseTreeNode,
  Tree,
  type TreeNodeOptions,
} from "@knime/virtual-tree";

import CodeExample from "./demo/CodeExample.vue";

const code = "";

const codeExample = `
import { Tree, type BaseTreeNode, type TreeNodeOptions } from "@knime/virtual-tree";

const loadData = (treeNode: BaseTreeNode, callback: (children: TreeNodeOptions[]) => void) => {
  callback([{ nodeKey: "more", name: "more loaded content" }]);
};

<Tree
  :source="[{
    nodeKey: 'fruit',
    name: 'Fruits',
    icon: markRaw(FileIcon),
    children: [
      {
        nodeKey: 'apple',
        name: 'Apples',
        icon: markRaw(AppleIcon),
        children: [
          { nodeKey: 'apple1', name: 'Alamanka' }
        ],
      }
    },
    { nodeKey: 'root/2', name: 'Vegetables' hasChildren: true },
  ]"
  :load-data="loadData"
/>`;

const codeExampleSlot = `
import { Tree, type BaseTreeNode, type TreeNodeOptions } from "@knime/virtual-tree";

const loadedTimes = ref(0);
const loadDataWithCustomSlot = async (
  treeNode: BaseTreeNode,
  callback: (children: TreeNodeOptions[]) => void,
) => {
  // eslint-disable-next-line no-magic-numbers
  await new Promise((r) => setTimeout(r, 1000));
  loadedTimes.value++;
  callback([
    {
      nodeKey: "more",
      name: "more loaded content #" + loadedTimes.value,
      customSlot: "somethingFancy",
    },
  ]);
};

<Tree
  ref="tree"
  :selectable="false"
  :source="[
    {
      nodeKey: 'veg',
      name: 'Vegetables',
      children: [{ nodeKey: 'carrot', name: 'Carrot' }],
    },
    {
      nodeKey: 'dyn',
      name: 'Dynamic Stuff',
      hasChildren: true,
    },
  ]"
  :load-data="loadDataWithCustomSlot"
>
  <template #leaf="{ treeNode }">
    <div @dblclick="console.log(treeNode)">
      {{ treeNode.name }}
    </div>
  </template>
  <template
    #somethingFancy="{ treeNode }: { treeNode: BaseTreeNode }"
  >
    {{ treeNode.name }}
    <button
      with-border
      @click="
        () => {
          $refs.tree?.clearChildren(treeNode.parentKey!);
          $refs.tree?.loadChildren(treeNode.parentKey!);
        }
      "
    >
      Reload
    </button>
  </template>
</Tree>
`;
const codeExampleVirtual = `
import { Tree } from "@knime/virtual-tree";
const selectedItemVirtualTree = ref();

<Tree
  :style="{ height: '120px', overflowY: 'auto' }"
  :source="hugeList"
  virtual
  @select-change="selectedItemVirtualTree = $event.node"
/>
`;

const selectedItem = ref();
const selectedItemVirtualTree = ref();
const doubleClickedItem = ref();

const loadData = (
  treeNode: BaseTreeNode,
  callback: (children: TreeNodeOptions[]) => void,
) => {
  callback([
    { nodeKey: "more", name: "more loaded content" },
    { nodeKey: "more2", name: "another item" },
  ]);
};

const loadedTimes = ref(0);
const loadDataWithCustomSlot = async (
  treeNode: BaseTreeNode,
  callback: (children: TreeNodeOptions[]) => void,
) => {
  // eslint-disable-next-line no-magic-numbers
  await new Promise((r) => setTimeout(r, 1200));
  loadedTimes.value++;
  callback([
    {
      nodeKey: "more",
      name: `more loaded content #${loadedTimes.value}`,
      customSlot: "somethingFancy",
    },
  ]);
};

// eslint-disable-next-line no-magic-numbers
const recursion = (path = "0", level = 3, h = 15): TreeNodeOptions[] => {
  const list = [];
  for (let i = 0; i < h; i += 1) {
    const nodeKey = `${path}-${i}`;
    const treeNode: TreeNodeOptions = {
      nodeKey,
      name: `Item ${nodeKey}`,
      children: [],
      hasChildren: level > 0,
    };

    if (level > 0) {
      treeNode.children = recursion(nodeKey, level - 1);
    }
    list.push(treeNode);
  }
  return list;
};

// eslint-disable-next-line no-magic-numbers
const hugeList = ref(recursion("v", 2, 35));
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            A tree that supports, focus, selection and virtualization (render
            only the visible parts). It is based on the package
            <a href="https://www.npmjs.com/package/@ysx-libs/vue-virtual-tree"
              >@ysx-libs/vue-virtual-tree</a
            >.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Tree
            :source="[
              {
                nodeKey: 'fruit',
                name: 'Fruits',
                icon: markRaw(FileIcon),
                children: [
                  {
                    nodeKey: 'apple',
                    name: 'Apples',
                    icon: markRaw(AppleIcon),
                    children: [
                      { nodeKey: 'apple1', name: 'Alamanka' },
                      { nodeKey: 'apple2', name: 'Albrechtapfel' },
                      { nodeKey: 'apple3', name: 'Alice' },
                    ],
                  },
                  {
                    nodeKey: 'oranges',
                    name: 'Oranges',
                    icon: markRaw(FileIcon),
                    children: [
                      { nodeKey: 'orange1', name: 'Blood Orange ' },
                      { nodeKey: 'orange2', name: 'Kumquat' },
                      { nodeKey: 'orange3', name: 'Clementine ' },
                    ],
                  },
                ],
              },
              {
                nodeKey: 'veg',
                name: 'Vegetables',
                children: [{ nodeKey: 'carrot', name: 'Carrot' }],
              },
              {
                nodeKey: 'dyn',
                name: 'Load async data',
                hasChildren: true,
              },
            ]"
            :load-data="loadData"
            @select-change="selectedItem = $event.node"
          />
        </div>
        <div class="grid-item-5">selected item: {{ selectedItem?.name }}</div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h4>Virtual</h4>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Tree
            :style="{ height: '120px', overflowY: 'auto' }"
            :source="hugeList"
            virtual
            @select-change="selectedItemVirtualTree = $event.node"
          />
        </div>
        <div class="grid-item-5">
          selected item: {{ selectedItemVirtualTree?.name }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExampleVirtual
          }}</CodeExample>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h4>Non selectable with slot to handle double click</h4>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Tree
            ref="tree3"
            :selectable="false"
            :source="[
              {
                nodeKey: 'veg',
                name: 'Vegetables',
                children: [{ nodeKey: 'carrot', name: 'Carrot' }],
              },
              {
                nodeKey: 'dyn',
                name: 'Dynamic Stuff',
                hasChildren: true,
              },
            ]"
            :load-data="loadDataWithCustomSlot"
          >
            <template #leaf="{ treeNode }">
              <div @dblclick="doubleClickedItem = treeNode">
                {{ treeNode.name }}
              </div>
            </template>
            <template
              #somethingFancy="{ treeNode }: { treeNode: BaseTreeNode }"
            >
              {{ treeNode.name }}
              <button
                with-border
                @click="
                  () => {
                    ($refs.tree3 as InstanceType<typeof Tree>)?.clearChildren(
                      treeNode.parentKey!,
                    );
                    ($refs.tree3 as InstanceType<typeof Tree>)?.loadChildren(
                      treeNode.parentKey!,
                    );
                  }
                "
              >
                Reload
              </button>
            </template>
          </Tree>
        </div>
        <div class="grid-item-5">
          double clicked item: {{ doubleClickedItem?.name }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExampleSlot
          }}</CodeExample>
          <CodeExample summary="Show Tree.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped></style>
