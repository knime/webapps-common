<script setup lang="ts">
import { h, onMounted, reactive, ref } from "vue";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";
import Dropdown from "webapps-common/ui/components/forms/Dropdown.vue";
import Button from "webapps-common/ui/components/Button.vue";
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
    name: "This item cannot be renamed",
    meta: {
      type: "Workflow",
    },
    isDirectory: false,
    isOpenableFile: true,
    isOpen: false,
    canBeRenamed: false,
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
    name: "File 3 (this item cannot be deleted)",
    meta: {
      type: "Metanode",
    },
    isDirectory: false,
    isOpenableFile: false,
    isOpen: false,
    canBeRenamed: true,
    canBeDeleted: false,
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
const shouldRenderCustomPreviewRect = ref<DOMRect | null>(null);

const activeRenamedItemId = ref<string | null>(null);

const toggleRemoteRenaming = () => {
  if (activeRenamedItemId.value) {
    activeRenamedItemId.value = null;
  } else {
    // item with id '1'
    activeRenamedItemId.value = "1";
  }
};

onMounted(() => {
  shouldRenderCustomPreviewRect.value =
    customDragPreviewTarget.value.getBoundingClientRect();
});

const onDrag = ({ event }: { event: DragEvent; item: FileExplorerItem }) => {
  const { clientX, clientY } = event;
  const isInside =
    clientX + document.documentElement.scrollLeft >=
      shouldRenderCustomPreviewRect.value.left &&
    clientX + document.documentElement.scrollLeft <
      shouldRenderCustomPreviewRect.value.right &&
    clientY + document.documentElement.scrollTop >=
      shouldRenderCustomPreviewRect.value.top &&
    clientY + document.documentElement.scrollTop <
      shouldRenderCustomPreviewRect.value.bottom;

  shouldRenderCustomPreview.value = isInside;
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
      // @ts-ignore
      const options = this.items.map((item) => {
        const onClick = () => {
          if (item.id === "custom-option") {
            window.alert("Rejoice! you clicked a custom context menu option");
            return;
          }

          onItemClick(item);
        };

        return h("li", { onClick }, item.text);
      });

      return h("ul", options);
    },
    computed: {
      items() {
        const renameOption = createRenameOption(anchor.item);
        const deleteOption = createDeleteOption(anchor.item);
        const customOption: FileExplorerContextMenu.MenuItem = {
          id: "custom-option",
          text: "My awesome custom option",
        };

        return [renameOption, deleteOption, customOption];
      },
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

        <div>
          Toggle programmatic rename
          <Button compact primary @click="toggleRemoteRenaming">{{
            activeRenamedItemId ? "Deactivate" : "Activate"
          }}</Button>
        </div>
      </div>
    </div>
    <div class="grid-container">
      <div class="grid-item-6">
        <div>
          The FileExplorer has built-in custom behavior when handling drag
          operations. When an item is dropped in an invalid target, the ghost
          will animate back to the original position. However, there are
          exceptions to this behavior which are controlled by the animation
          modes.
        </div>

        <span v-if="draggingAnimationMode === 'auto'">
          AUTO:
          <ul>
            <li>
              When dropping an item to a directory (aka a move), the ghosts will
              be automatically removed, as if the move was successful
            </li>
            <li>
              When dropping an item to an element outside the FileExplorer, if
              said element handles drag events (prevents browser defaults), then
              the ghosts will be automatically removed because the component
              assumes the drop was successful
            </li>
          </ul>
        </span>
        <span v-if="draggingAnimationMode === 'manual'">
          MANUAL:
          <ul>
            <li>
              When dropping an item to a directory (aka a move) the ghosts will
              NOT be removed. Instead the consumer will have to call an
              <code>onComplete</code> callback provided in the
              <strong>drop</strong> event payload to determine whether the move
              was successful or not. (Useful for async operations)
            </li>
            <li>
              Similarly, when dropping an item to an element outside the
              FileExplorer the ghosts will also NOT be removed unless the
              <code>onComplete</code> provided in the
              <strong>dragend</strong> event is called and stating whether
              dropping on this external element is valid or not
            </li>
          </ul>
        </span>
        <span v-if="draggingAnimationMode === 'disabled'">
          DISABLED:
          <ul>
            <li>
              This mode will disable the custom drag ghosts and revert to using
              the native browser drag ghosts.
            </li>
            <li>This will also disable the custom preview feature</li>
          </ul>
        </span>
      </div>
      <div class="grid-item-6">
        <div>
          Dragging animation mode
          <!-- eslint-disable vue/attribute-hyphenation -->
          <Dropdown
            v-model="draggingAnimationMode"
            ariaLabel="A List"
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
          <!-- eslint-enable vue/attribute-hyphenation -->
        </div>
      </div>
    </div>
  </section>
  <section class="demo">
    <div class="grid-container">
      <div class="grid-item-6 wrapper">
        <FileExplorer
          :disable-context-menu="options.disableContextMenu"
          :disable-multi-select="options.disableMultiSelect"
          :items="items"
          :disable-dragging="options.disableDragging"
          :dragging-animation-mode="draggingAnimationMode"
          :is-root-folder="false"
          :active-renamed-item-id="activeRenamedItemId"
          @drag="onDrag"
          @rename-file="onRename"
          @delete-items="onDelete"
        >
          <template v-if="shouldRenderCustomPreview" #customDragPreview>
            <div class="custom-preview-element">I am a custom drag preview</div>
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
        <div
          ref="customDragPreviewTarget"
          dropzone="copy"
          class="custom-drag-preview-target"
          @dragover.prevent
        >
          Drag an item from the file explorer over me to see something nice 😉
        </div>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped>
.demo {
  margin-top: 3rem;
}

.wrapper {
  background: var(--knime-silver-sand);
  padding: 10px;
}

.options {
  display: flex;
  gap: 1.5rem;
  align-items: center;
  margin-bottom: 2rem;

  & div {
    display: flex;
    gap: 0.2rem;
    align-items: center;
  }
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
  min-width: 300px;
  height: 150px;
  border-radius: 4px;
  background-color: var(--knime-masala);
  color: white;
  padding: 4px;
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

    & :deep(li[disabled="true"]) {
      color: var(--knime-silver-sand);
      cursor: not-allowed;
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
