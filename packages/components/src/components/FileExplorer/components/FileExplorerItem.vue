<script setup lang="ts">
import { type Ref, nextTick, ref, toRefs, watch } from "vue";
import { OnClickOutside } from "@vueuse/components";

import FileTextIcon from "@knime/styles/img/icons/file-text.svg";
import FolderIcon from "@knime/styles/img/icons/folder.svg";

import { useNameValidator } from "../../../composables";
import InputField from "../../forms/InputField/InputField.vue";
import type { FileExplorerItem, ItemIconRenderer } from "../types";

import FileExplorerItemBase from "./FileExplorerItemBase.vue";

interface Props {
  blacklistedNames: Array<string>;
  item: FileExplorerItem;
  isSelected: boolean;
  isDragging: boolean;
  isRenameActive: boolean;
  disabled: boolean;
  isDraggingEnabled?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  isDraggingEnabled: true,
});

const defaultIconRenderer: ItemIconRenderer = (item) => {
  return item.isDirectory ? FolderIcon : FileTextIcon;
};

const { isRenameActive, blacklistedNames } = toRefs(props);

interface Emits {
  (e: "dblclick", nativeEvent: MouseEvent): void;
  (e: "click", nativeEvent: MouseEvent): void;
  (e: "dragstart", nativeEvent: DragEvent): void;
  (e: "dragenter", nativeEvent: DragEvent): void;
  (e: "dragover", nativeEvent: DragEvent): void;
  (e: "drag", nativeEvent: DragEvent): void;
  (e: "dragleave", nativeEvent: DragEvent): void;
  (e: "dragend", nativeEvent: DragEvent): void;
  (e: "drop", nativeEvent: DragEvent): void;
  (e: "contextmenu", nativeEvent: MouseEvent): void;
  (e: "rename:submit", payload: { itemId: string; newName: string }): void;
  (e: "rename:clear"): void;
}

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
      class="item-content"
      :class="{
        light: !item.isDirectory,
        'rename-active': isRenameActive,
      }"
      :title="item.name"
    >
      <template v-if="$slots.default">
        <slot :is-rename-active="isRenameActive" :is-selected="isSelected" />
      </template>

      <template v-else>
        <span v-if="!isRenameActive">
          {{ item.name }}
        </span>

        <template v-else>
          <OnClickOutside
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
      </template>
    </td>
  </FileExplorerItemBase>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.file-explorer-item {
  & .item-content {
    width: 100%;
    height: 100%;
    display: flex;
    flex: 2 1 auto;
    align-items: center;
    padding: calc(var(--item-padding) * 1px);
    text-overflow: ellipsis;
    overflow: hidden;
    white-space: nowrap;
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
    font-size: 13px;
    line-height: 1.5;
    backdrop-filter: blur(10px);
    font-weight: 300;
    position: absolute;
    color: var(--theme-color-error);
    padding: 7px 5px;
    margin-top: 5px;
    white-space: normal;
  }

  &:not(.selected, .dragging, .dragging-over) .item-content.light {
    background-color: var(--knime-white);
  }

  & td.rename-active {
    padding: 0;

    & .rename-input {
      pointer-events: auto;
      height: 26px;
      padding: 0;
      margin: 4px 0 5px;

      & :deep(input) {
        font-size: var(--item-font-size);
        padding: 0 calc(var(--item-padding) * 1px);
      }
    }
  }

  & .open-indicator {
    position: absolute;
    width: 10px;
    height: 10px;
    background: var(--knime-dove-gray);
    border-radius: 50%;
    bottom: 4px;
    right: 4px;
  }
}
</style>
