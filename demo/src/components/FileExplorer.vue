<script setup lang="ts">
import FileExplorer from "webapps-common/ui/components/FileExplorer/FileExplorer.vue";

const items = [
  {
    id: "0",
    name: "Folder 1",
    meta: {
      type: "Folder",
    },
    isDirectory: true,
    isOpenableFile: false,
    isOpen: false,
    canBeRenamed: true,
    canBeDeleted: true,
  },
  {
    id: "1",
    name: "Folder 2",
    meta: {
      type: "Folder",
    },
    isDirectory: true,
    isOpenableFile: false,
    isOpen: false,
    canBeRenamed: true,
    canBeDeleted: true,
  },
  {
    id: "2",
    name: "File 1",
    meta: {
      type: "Workflow",
    },
    isDirectory: false,
    isOpenableFile: true,
    isOpen: false,
    canBeRenamed: true,
    canBeDeleted: true,
  },
  {
    id: "3",
    name: "File 2",
    meta: {
      type: "Workflow",
    },
    isDirectory: false,
    isOpenableFile: true,
    isOpen: false,
    canBeRenamed: true,
    canBeDeleted: true,
  },
  {
    id: "4",
    name: "File 3",
    meta: {
      type: "Component",
    },
    isDirectory: false,
    isOpenableFile: false,
    isOpen: false,
    canBeRenamed: true,
    canBeDeleted: true,
  },
  {
    id: "5",
    name: "File 3",
    meta: {
      type: "Metanode",
    },
    isDirectory: false,
    isOpenableFile: false,
    isOpen: false,
    canBeRenamed: true,
    canBeDeleted: true,
  },
];
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-6 wrapper">
        <FileExplorer :items="items" :is-root-folder="false">
          <!-- <template v-if="nodeTemplate && isAboveCanvas" #customDragPreview>
          <NodePreview
            :type="nodeTemplate.type"
            :in-ports="nodeTemplate.inPorts"
            :out-ports="nodeTemplate.outPorts"
            :icon="nodeTemplate.icon"
          />
        </template>

        <template
          #contextMenu="{
            createRenameOption,
            createDeleteOption,
            anchor,
            onItemClick,
            isMultipleSelectionActive,
            closeContextMenu,
          }"
        >
          <SpaceExplorerContextMenu
            :create-rename-option="createRenameOption"
            :create-delete-option="createDeleteOption"
            :anchor="anchor"
            :on-item-click="onItemClick"
            :is-multiple-selection-active="isMultipleSelectionActive"
            :close-context-menu="closeContextMenu"
            :project-id="projectId"
            :selected-item-ids="selectedItemIds"
          />
        </template> -->
        </FileExplorer>
      </div>
      <div class="grid-item-6"><strong>Output:</strong><br /></div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.wrapper {
  background: var(--knime-silver-sand);
  padding: 10px;
}
</style>
