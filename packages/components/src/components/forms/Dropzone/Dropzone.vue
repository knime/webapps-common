<script lang="ts" setup>
import { computed, ref } from "vue";

import CloseIcon from "@knime/styles/img/icons/circle-close.svg";
import AddIcon from "@knime/styles/img/icons/circle-plus.svg";
import FilePlus from "@knime/styles/img/icons/file-plus.svg";

import Button from "../../Buttons/Button.vue";

export type DropzoneProps = {
  labelText?: string;
  accept?: string[];
  multiple?: boolean;
  layout?: "vertical" | "horizontal";
  empty?: boolean;
  error?: boolean;
  disabled?: boolean;
};

const props = withDefaults(defineProps<DropzoneProps>(), {
  labelText: "Choose a file or drag it here",
  accept: () => [],
  multiple: false,
  layout: "vertical",
  empty: true,
  error: false,
  disabled: false,
});

const emit = defineEmits<{
  (event: "files-selected", files: File[]): void;
}>();

const isDragging = ref(false);
const errorText = ref<string | null>(null);
const defaultContentRef = ref<HTMLElement | null>(null);
const inputRef = ref<HTMLInputElement | null>(null);

const dropzoneClasses = computed(() => ({
  dropzone: true,
  active: isDragging.value && !errorText.value,
  error: props.error || errorText.value,
  "custom-content": !props.empty,
  disabled: props.disabled || errorText.value,
  vertical: props.layout === "vertical",
  horizontal: props.layout === "horizontal",
}));

const handleFiles = (files: FileList | null) => {
  if (!files?.length) {
    return;
  }
  const fileArray = Array.from(files);
  emit("files-selected", fileArray);

  // Reset the input so the same file can be selected again
  if (inputRef.value) {
    inputRef.value.value = "";
  }
};

const onDrop = (e: DragEvent) => {
  isDragging.value = false;
  if (!props.disabled && !errorText.value) {
    handleFiles(e.dataTransfer?.files || null);
  }
  errorText.value = null;
};

const onDragOver = (e: DragEvent) => {
  if (props.disabled) {
    return;
  }
  isDragging.value = true;
  if (e.dataTransfer) {
    e.dataTransfer.dropEffect = "copy";
    e.dataTransfer.effectAllowed = "copy";

    // Check if any of the dragged files are not allowed
    if (e.dataTransfer.items) {
      const items = Array.from(e.dataTransfer.items);
      if (items.length > 1 && !props.multiple) {
        errorText.value = "Multiple files are not allowed";
      } else {
        errorText.value = items.some(
          (item) =>
            props.accept.length > 0 &&
            !props.accept.some((type) => item.type.match(type)),
        )
          ? "File type not allowed"
          : null;
      }
      if (errorText.value) {
        e.dataTransfer.effectAllowed = "none";
      }
    }
  }
};

const onDragLeave = (e: DragEvent) => {
  if (e.target === e.currentTarget) {
    isDragging.value = false;
    errorText.value = null;
  }
};

const triggerInput = (e: Event) => {
  if (inputRef.value) {
    inputRef.value.click();
  }
  e.stopPropagation();
};

const onClick = (e: MouseEvent) => {
  if (props.disabled || !props.empty) {
    return;
  }
  const target = e.target as HTMLElement;
  /* sometimes the prop empty is already true even though the click was done on custom content (e.g. deletion of last item)
   * to reliably check if the click was done on the default content, we check if the event.target originates from inside */
  const defaultContent = defaultContentRef.value;
  if (defaultContent && defaultContent.contains(target)) {
    triggerInput(e);
  }
};

const onKeyDown = (e: KeyboardEvent) => {
  if (props.empty && (e.key === "Enter" || e.key === " ")) {
    triggerInput(e);
  }
};

const onChange = (e: Event) => {
  if (props.disabled) {
    return;
  }

  const target = e.target as HTMLInputElement;
  if (target.files) {
    handleFiles(target.files);
  }
};

const accept = computed(() =>
  props.accept?.length ? props.accept.join(",") : "",
);

const supportedFormatsText = computed(() =>
  props.accept?.length ? `Only ${props.accept.join(", ")}` : "",
);
const icon = computed(() => (errorText.value ? CloseIcon : FilePlus));
</script>

<template>
  <div
    :class="dropzoneClasses"
    role="button"
    :tabindex="empty && !disabled ? 0 : -1"
    aria-label="File upload dropzone"
    @drop.prevent="onDrop"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @click="onClick"
    @keydown="onKeyDown"
  >
    <slot>
      <div
        ref="defaultContentRef"
        class="dropzone-content"
        data-default-content
      >
        <slot name="icon">
          <Component :is="icon" class="dropzone-icon" />
        </slot>
        <div class="dropzone-info">
          <div class="dropzone-text">
            {{ errorText ?? props.labelText }}
          </div>
          <div class="dropzone-format">{{ supportedFormatsText }}</div>
        </div>
        <slot name="button">
          <Button
            class="dropzone-button"
            primary
            compact
            :disabled="props.disabled"
            tabindex="-1"
            @click="triggerInput"
          >
            Browse files
          </Button>
        </slot>
      </div>
    </slot>
    <Button
      v-if="props.multiple && !props.empty"
      class="add-button"
      primary
      compact
      :disabled="props.disabled"
      @click="triggerInput"
    >
      <AddIcon />
      Add files
    </Button>
    <input
      v-if="props.empty || props.multiple"
      ref="inputRef"
      type="file"
      hidden
      :disabled="props.disabled"
      :accept="accept"
      :multiple="props.multiple"
      :webkitdirectory="false"
      @change="onChange"
    />
  </div>
</template>

<style scoped lang="postcss">
@import url("@knime/styles/css/mixins.css");

.dropzone {
  display: flex;
  flex-direction: column;
  gap: var(--space-12);
  align-items: center;
  justify-content: space-between;
  width: 100%;
  min-width: 250px;
  padding: var(--space-16);
  margin: 0 auto;
  overflow: hidden;
  cursor: pointer;
  background-color: var(--knime-gray-ultra-light);
  border: 1px dashed var(--knime-silver-sand-semi);
  border-radius: 12px;
  transition: all 0.2s;

  &.disabled {
    cursor: no-drop;
    opacity: 0.5;
  }

  &:focus-visible {
    outline: none;
  }

  &:not(.disabled) {
    &.active {
      cursor: copy;
      background-color: var(--knime-cornflower-semi);
      border-color: var(--knime-cornflower);
    }

    &:not(.custom-content) {
      &:focus-visible {
        border-color: var(--knime-cornflower);
      }

      &:hover {
        background-color: var(--knime-cornflower-semi);
        border-color: var(--knime-cornflower);
      }
    }
  }

  & .dropzone-content {
    display: flex;
    flex-direction: column;
    gap: var(--space-12);
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  }

  & .dropzone-icon {
    display: inline-block;
    flex-shrink: 0;
    vertical-align: middle;
    stroke: var(--knime-dove-gray);

    @mixin svg-icon-size 32;
  }

  & .dropzone-info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    align-items: center;
    color: var(--knime-dove-gray);
    text-align: center;

    & .dropzone-text {
      font-size: 13px;
      font-weight: 500;
      line-height: 14px;
    }

    & .dropzone-format {
      font-size: 10px;
      font-weight: 400;
      line-height: 12px;
    }
  }

  & .dropzone-button {
    flex-shrink: 0;
  }

  &.error {
    border-color: var(--theme-color-error);
  }

  &.custom-content {
    cursor: auto;
    background-color: transparent;
  }

  &.horizontal .dropzone-content {
    flex-direction: row;
    justify-content: space-between;

    & .dropzone-info {
      flex-grow: 1;
      align-items: flex-start;
      text-align: left;
    }
  }
}
</style>
