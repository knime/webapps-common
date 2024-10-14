<script lang="ts" setup>
import { ref } from "vue";

import Button from "../../../Buttons/Button.vue";
import { type DropzoneProps } from "../types";

const props = withDefaults(defineProps<DropzoneProps>(), {
  labelText: "Choose a file or drag it here",
  supportedFormats: "Supported formats: .pdf, .docx, .jpeg, .png, .xls, .xlsx",
  disabled: false,
  disallowed: false,
});

const emit = defineEmits<{
  (e: "file-added", file: File): void;
}>();

const dragOver = ref(false);
const dragging = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const onDragOver = () => {
  if (props.disabled || props.disallowed) {
    return;
  }
  dragOver.value = true;
};

const onDragLeave = () => {
  dragOver.value = false;
};

const onDrop = (e: DragEvent) => {
  if (props.disabled || props.disallowed) {
    return;
  }
  dragOver.value = false;
  const file = e.dataTransfer?.files[0];
  if (file) {
    emit("file-added", file);
  }
};

const triggerInput = () => {
  if (inputRef.value) {
    inputRef.value.click();
  }
};

const onChange = (e: Event) => {
  if (props.disabled || props.disallowed) {
    return;
  }

  const target = e.target as HTMLInputElement;
  if (target.files) {
    Array.from(target.files).forEach((file) => {
      emit("file-added", file);
    });
  }
};
</script>

<template>
  <div
    class="dropzone"
    :class="{
      'dropzone-active': dragging,
      'dropzone-hovered': dragOver,
      disable: props.disabled || props.disallowed,
    }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @drop.prevent="onDrop"
  >
    <div class="dropzone-content">
      <slot name="icon">
        <Component :is="props.icon" class="dropzone-icon" />
      </slot>
      <div class="dropzone-info">
        <p class="dropzone-text">
          {{ props.labelText }}
        </p>
        <p class="dropzone-format">
          {{ props.supportedFormats }}
        </p>
      </div>
      <slot name="button">
        <Button
          primary
          compact
          :disabled="props.disabled"
          @click="triggerInput"
        >
          Browse files
        </Button>
      </slot>
    </div>
    <input ref="inputRef" type="file" hidden @change="onChange" />
  </div>
</template>

<style scoped lang="postcss">
@import url("@knime/styles/css/mixins.css");

.dropzone {
  background-color: var(--knime-gray-ultra-light);
  border: 2px dashed var(--knime-silver-sand-semi);
  max-width: 100%;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: border-color 0.3s;
  margin: 0 auto;
  display: flex;
  padding: 16px 0;
  flex-direction: column;
  gap: 12px;

  &.disable {
    opacity: 0.5;
    cursor: not-allowed;

    &:hover {
      background-color: var(--knime-gray-ultra-light); /* No hover effect */
    }
  }

  &:not(.disable) {
    &:hover {
      background-color: var(--knime-cornflower-semi);

      & .yellow-button {
        background-color: var(--knime-black);
        color: var(--knime-white);
      }
    }

    &.dropzone-active {
      border-color: var(--knime-cornflower-semi);
    }

    &.dropzone-hovered {
      background-color: var(--knime-cornflower-semi);

      & .yellow-button {
        background-color: var(--knime-black);
        color: var(--knime-white);
      }
    }
  }

  & .dropzone-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    height: 100%;
  }

  & .dropzone-icon {
    display: inline-block;
    text-decoration: none;
    vertical-align: middle;
    text-align: center;
    stroke: var(--knime-dove-gray);

    @mixin svg-icon-size 32;
  }

  & .dropzone-info {
    & .dropzone-text {
      font-weight: 600;
      font-size: 13px;
      text-align: center;
      line-height: 14px;
    }

    & .dropzone-format {
      font-weight: 400;
      font-size: 10px;
      text-align: center;
      line-height: 12px;
    }

    & .dropzone-max-size {
      margin-top: 5px;
      font-size: 12px;
      color: var(--knime-dove-gray);
    }
  }
}
</style>
