<script setup lang="ts">
import { h, reactive, ref } from "vue";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";
import Dropdown from "webapps-common/ui/components/forms/Dropdown.vue";
import FileExplorer from "webapps-common/ui/components/FileExplorer/FileExplorer.vue";
import type {
  FileExplorerItem,
  FileExplorerContextMenu,
} from "webapps-common/ui/components/FileExplorer/types";

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

const options = reactive({
  disableContextMenu: false,
  disableMultiSelect: false,
  disableDragging: false,
  useCustomContextMenu: false,
});

const draggingAnimationMode = ref<"auto" | "manual" | "disabled">("auto");

const customDragPreviewTarget = ref<HTMLDivElement | null>(null);
const shouldRenderCustomPreview = ref(false);

const onDrag = ({ event }: { event: DragEvent; item: FileExplorerItem }) => {
  const elementBelowDrag = document.elementFromPoint(
    event.clientX,
    event.clientX,
  );

  shouldRenderCustomPreview.value =
    customDragPreviewTarget.value.contains(elementBelowDrag);
};

// This would ideally go into a separate component, but for DEMO PURPOSES
// we can do it like this with an inline render function
const customContextMenuComponent = ({
  anchor,
  onItemClick,
  createRenameOption,
  createDeleteOption,
}: {
  // this is a reference to the item in the explorer where the menu was opened on
  anchor: FileExplorerContextMenu.Anchor;

  // this is the handler for the default options (rename & delete). It has to be called
  // only for those options because it works with the internals of the FileExplorer to handle them.
  // For any other custom option you can handle that yourself
  onItemClick: FileExplorerContextMenu.ItemClickHandler;

  // These 2 are factory fns used to create the 2 default options that come with the FileExplorer -> rename & delete
  createRenameOption: FileExplorerContextMenu.CreateDefaultMenuOption;
  createDeleteOption: FileExplorerContextMenu.CreateDefaultMenuOption;
}) => {
  return {
    render() {
      const renameOption = createRenameOption(anchor.item);
      const deleteOption = createDeleteOption(anchor.item);

      const renameElement = h(
        "li",
        { onClick: () => onItemClick(renameOption) },
        renameOption.text,
      );

      const deleteElement = h(
        "li",
        { onClick: () => onItemClick(deleteOption) },
        deleteOption.text,
      );

      return h("ul", [renameElement, deleteElement]);
    },
  };
};

const onRename = (item) => {
  window.alert(`You renamed: >> ${JSON.stringify(item)}`);
};
const onDelete = (item) => {
  window.alert(`You deleted: >> ${JSON.stringify(item)}`);
};
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12 options">
        <Checkbox v-model="options.disableContextMenu">
          Disable context menu
        </Checkbox>
        <Checkbox v-model="options.disableMultiSelect">
          Disable multi-select
        </Checkbox>
        <Checkbox v-model="options.disableDragging">
          Disable dragging
        </Checkbox>
        <Checkbox v-model="options.useCustomContextMenu">
          Custom context menu
        </Checkbox>
        <Dropdown
          v-model="draggingAnimationMode"
          :aria-label="'A List'"
          :possible-values="[
            {
              id: 'auto',
              text: 'Auto',
            },
            {
              id: 'manual',
              text: 'Manual',
            },
            {
              id: 'disabled',
              text: 'Disabled',
            },
          ]"
        />
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-6 wrapper">
        <FileExplorer
          :disable-context-menu="options.disableContextMenu"
          :disable-multi-select="options.disableMultiSelect"
          :items="items"
          :disable-dragging="options.disableDragging"
          :dragging-animation-mode="draggingAnimationMode"
          :is-root-folder="false"
          @drag="onDrag"
          @rename-file="onRename"
          @delete-items="onDelete"
        >
          <template v-if="shouldRenderCustomPreview" #customDragPreview>
            <div class="custom-preview-element">I am a cutom drag preview</div>
          </template>

          <template
            v-if="options.useCustomContextMenu"
            #contextMenu="{
              createRenameOption,
              createDeleteOption,
              anchor,
              onItemClick,
              isMultipleSelectionActive,
              closeContextMenu,
            }"
          >
            <div class="custom-context-menu">
              <Component
                :is="
                  customContextMenuComponent({
                    anchor,
                    createRenameOption,
                    createDeleteOption,
                    onItemClick,
                  })
                "
              />
              <div class="menu-footer">
                <button @click="closeContextMenu">
                  click me to close the menu programmatically
                </button>
                <span v-if="!options.disableMultiSelect">
                  You can also know inside the menu if the multi-selection is
                  active: -> {{ isMultipleSelectionActive }}
                </span>
              </div>
            </div>
          </template>
        </FileExplorer>
      </div>
      <div class="grid-item-6">
        <strong>Output:</strong><br />
        <div ref="customDragPreviewTarget" class="custom-drag-preview-target">
          Drag an item from the file explorer over me to see something nice 😉
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.wrapper {
  background: var(--knime-silver-sand);
  padding: 10px;
}

.options {
  display: flex;
  gap: 0.5rem;
}

.custom-drag-preview-target {
  border: 4px dashed var(--knime-stone-gray);
  background: var(--knime-porcelain);
  width: 500px;
  height: 400px;
  margin: 8px 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  text-align: center;
}

.custom-preview-element {
  width: 150px;
  height: 150px;
  border-radius: 4px;
  background-color: var(--knime-masala);
  color: white;
  padding: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.custom-context-menu {
  min-width: 60px;
  border-radius: 4px;
  background: var(--knime-porcelain);
  color: var(--knime-masala);
  border: 1px solid black;

  & ul {
    list-style-type: none;
    padding: 0;
    margin: 0;

    & :deep(li) {
      padding: 6px 10px;
      cursor: pointer;

      &:hover {
        background: var(--knime-masala);
        color: white;
      }
    }
  }

  & .menu-footer {
    display: flex;
    flex-direction: column;

    & button,
    & span {
      margin: 10px;
    }
  }
}
</style>
