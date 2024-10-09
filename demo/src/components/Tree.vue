<script setup lang="ts">
import { ref } from "vue";

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
  :source="[
    { nodeKey: 'root/1', name: 'rootNode1', children: [{ nodeKey: 'sub/1', name: 'sub1'}] },
    { nodeKey: 'root/2', name: 'rootNode2' hasChildren: true },
  ]"
  :load-data="loadData"
/>`;

const codeExampleSlot = `
import { Tree, type BaseTreeNode, type TreeNodeOptions } from "@knime/virtual-tree";

const loadData = (treeNode: BaseTreeNode, callback: (children: TreeNodeOptions[]) => void) => {
  callback([{ nodeKey: "more", name: "more loaded content" }]);
};

<Tree
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
  :load-data="loadData"
>
  <template #leaf="{ treeNode }">
    <div @dblclick="console.log(treeNode)">
      {{ treeNode.name }}
    </div>
  </template>
</Tree>
`;

const selectedItem = ref();
const doubleClickedItem = ref();

const loadData = async (
  treeNode: BaseTreeNode,
  callback: (children: TreeNodeOptions[]) => void,
) => {
  // eslint-disable-next-line no-magic-numbers
  await new Promise((r) => setTimeout(r, 800));
  callback([
    { nodeKey: "more", name: "more loaded content" },
    { nodeKey: "more2", name: "another item" },
  ]);
};
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
                children: [
                  {
                    nodeKey: 'apple',
                    name: 'Apples',
                    children: [
                      { nodeKey: 'apple1', name: 'Alamanka' },
                      { nodeKey: 'apple2', name: 'Albrechtapfel' },
                      { nodeKey: 'apple3', name: 'Alice' },
                    ],
                  },
                  {
                    nodeKey: 'oranges',
                    name: 'Oranges',
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
                name: 'Dynamic Stuff',
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
          <h4>Non selectable with slot to handle double click</h4>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Tree
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
            :load-data="loadData"
          >
            <template #leaf="{ treeNode }">
              <div @dblclick="doubleClickedItem = treeNode">
                {{ treeNode.name }}
              </div>
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
