<script setup lang="ts">
import {
  type Ref,
  computed,
  nextTick,
  ref,
  toRefs,
  useSlots,
  watch,
} from "vue";
import { OnClickOutside } from "@vueuse/components";

import FileTextIcon from "@knime/styles/img/icons/file-text.svg";
import FolderIcon from "@knime/styles/img/icons/folder.svg";

import { useNameValidator } from "../../../composables";
import InputField from "../../forms/InputField/InputField.vue";
import type { FileExplorerItem, ItemIconRenderer } from "../types";
import { filterSlotsForDynamicColumns } from "../utils/filterSlotsForDynamicColumns";

import FileExplorerItemBase from "./FileExplorerItemBase.vue";

type Props = {
  blacklistedNames: Array<string>;
  item: FileExplorerItem;
  isSelected: boolean;
  isDragging: boolean;
  isRenameActive: boolean;
  disabled: boolean;
  isDraggingEnabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  isDraggingEnabled: true,
});

const defaultIconRenderer: ItemIconRenderer = (item) => {
  return item.isDirectory ? FolderIcon : FileTextIcon;
};

const { isRenameActive, blacklistedNames } = toRefs(props);

type Emits = {
  dblclick: [nativeEvent: MouseEvent];
  click: [nativeEvent: MouseEvent];
  dragstart: [nativeEvent: DragEvent];
  dragenter: [nativeEvent: DragEvent];
  dragover: [nativeEvent: DragEvent];
  drag: [nativeEvent: DragEvent];
  dragleave: [nativeEvent: DragEvent];
  dragend: [nativeEvent: DragEvent];
  drop: [nativeEvent: DragEvent];
  contextmenu: [nativeEvent: MouseEvent];
  "rename:submit": [payload: { itemId: string; newName: string }];
  "rename:clear": [];
};

const emit = defineEmits<Emits>();

const renameInput: Ref<InstanceType<typeof InputField> | null> = ref(null);
const renameValue = ref("");

const { isValid, errorMessage, cleanedName } = useNameValidator({
  blacklistedNames,
  name: renameValue,
});

const setupRenameInput = async () => {
  renameValue.value = props.item.name;
  await nextTick();

  const inputElement = renameInput.value?.$refs?.input as HTMLInputElement;
  inputElement?.setSelectionRange(0, renameValue.value.length);
  inputElement?.focus();
};

watch(isRenameActive, async (isActive) => {
  if (isActive) {
    await setupRenameInput();
  }
});

const baseItem = ref<InstanceType<typeof FileExplorerItemBase>>();
const focusItem = async () => {
  await nextTick();
  // give back focus
  baseItem.value?.$el.focus();
};
const onRenameSubmit = (keyupEvent: KeyboardEvent, isClickAway = false) => {
  if (keyupEvent.key === "Escape") {
    emit("rename:clear");
    focusItem();
  }

  if ((keyupEvent.key === "Enter" || isClickAway) && isValid.value) {
    const newName = cleanedName.value;
    const isSameName = newName === props.item.name;

    if (newName === "" || isSameName) {
      emit("rename:clear");
      focusItem();
      return;
    }

    emit("rename:submit", {
      itemId: props.item.id,
      newName,
    });
    emit("rename:clear");
    focusItem();
  }
};

const slots = useSlots();

const dynamicDefaultGridColumns = computed(() => {
  const length = Object.keys(filterSlotsForDynamicColumns(slots) ?? {}).length;
  return length === 0 ? "" : `repeat(${length}, auto)`;
});

const optionsMenuGridColumn = computed(() => {
  return slots.optionsMenu ? "30px" : "";
});
</script>

<template>
  <FileExplorerItemBase
    ref="baseItem"
    class="file-explorer-item"
    :class="{
      disabled,
    }"
    :is-dragging="isDragging"
    :is-selected="isSelected"
    :draggable="isDraggingEnabled && !isRenameActive"
    :disabled
    @dragstart="!isRenameActive && emit('dragstart', $event)"
    @dragenter="!isRenameActive && emit('dragenter', $event)"
    @dragover="emit('dragover', $event)"
    @dragleave="!isRenameActive && emit('dragleave', $event)"
    @dragend="!isRenameActive && emit('dragend', $event)"
    @drag="emit('drag', $event)"
    @click="emit('click', $event)"
    @contextmenu.prevent="!isRenameActive && emit('contextmenu', $event)"
    @drop.prevent="!isRenameActive && emit('drop', $event)"
    @dblclick="!isRenameActive && emit('dblclick', $event)"
  >
    <template #icon>
      <span v-if="item.isOpen" class="open-indicator" />
      <slot name="icon">
        <Component :is="defaultIconRenderer(item)" />
      </slot>
    </template>

    <td
      class="column"
      data-test-id="item-name"
      :class="{
        light: !item.isDirectory,
        'rename-active': isRenameActive,
      }"
      :title="item.name"
    >
      <div v-if="!isRenameActive" class="inner">
        <slot :is-rename-active="isRenameActive" :is-selected="isSelected">{{
          item.name
        }}</slot>
      </div>

      <template v-else>
        <OnClickOutside
          class="rename-input-container"
          @trigger="($event: any) => onRenameSubmit($event, true)"
        >
          <div>
            <InputField
              ref="renameInput"
              v-model="renameValue"
              class="rename-input"
              type="text"
              title="rename"
              :is-valid="isValid"
              @keydown.stop="onRenameSubmit($event)"
            />
            <div v-if="!isValid" class="item-error">
              <span>{{ errorMessage }}</span>
            </div>
          </div>
        </OnClickOutside>
      </template>
    </td>
    <td
      v-for="(_, name) of filterSlotsForDynamicColumns($slots)"
      :key="`dynamicColumn-${name}`"
      :class="['column', 'dynamic-column', { light: !item.isDirectory }]"
    >
      <div class="inner">
        <slot
          :name="name"
          :is-rename-active="isRenameActive"
          :is-selected="isSelected"
        />
      </div>
    </td>
    <td
      v-if="$slots.optionsMenu"
      :class="['column', { light: !item.isDirectory }]"
    >
      <slot name="optionsMenu" />
    </td>
  </FileExplorerItemBase>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.file-explorer-item {
  display: grid;
  grid-template-columns:
    30px var(--file-explorer-item-grid, 1fr v-bind("dynamicDefaultGridColumns"))
    v-bind("optionsMenuGridColumn");

  & .column {
    display: flex;
    align-items: center;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;

    & .inner {
      width: 100%;
      padding: calc(var(--item-padding, 0) * 1px);
      overflow: hidden;
      text-overflow: ellipsis;
    }

    &.dynamic-column:empty {
      display: none;
    }
  }

  &:focus {
    outline: none;

    &.keyboard-focus {
      @mixin focus-outline;
    }
  }

  &.disabled {
    pointer-events: none;

    & .item-content {
      color: var(--knime-masala-semi);
    }

    & .item-icon {
      & :slotted(svg) {
        stroke: var(--knime-masala-semi);
      }
    }
  }

  &:not(.disabled) .item-content {
    color: var(--knime-masala);
  }

  & .item-error {
    position: absolute;
    bottom: 0;
    z-index: 10;
    padding: 7px 5px;
    margin-top: 5px;
    font-size: 13px;
    font-weight: 300;
    line-height: 1.5;
    color: var(--theme-color-error);
    white-space: normal;
    backdrop-filter: blur(10px);
    transform: translateY(100%);
  }

  &:not(.selected, .dragging, .dragging-over) .column.light {
    background-color: var(--knime-white);
  }

  & td.rename-active {
    & .rename-input-container {
      flex: 1;
    }

    & .rename-input {
      height: 26px;
      padding: 0;
      margin: 4px 0 5px;
      pointer-events: auto;

      & :deep(input) {
        padding: 0 calc(var(--item-padding, 0) * 1px);
        font-size: var(--item-font-size, unset);
      }
    }
  }

  & .open-indicator {
    position: absolute;
    right: 4px;
    bottom: 4px;
    width: 10px;
    height: 10px;
    background: var(--knime-dove-gray);
    border-radius: 50%;
  }
}
</style>
