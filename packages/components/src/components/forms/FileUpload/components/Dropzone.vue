<script lang="ts" setup>
import { computed, ref } from "vue";

import CloseIcon from "@knime/styles/img/icons/circle-close.svg";
import FilePlus from "@knime/styles/img/icons/file-plus.svg";

import Button from "../../../Buttons/Button.vue";
import { type DropzoneProps } from "../types";

const props = withDefaults(defineProps<DropzoneProps>(), {
  labelText: "Choose a file or drag it here",
  disallowed: false,
});
const errorState = ref(false);

const emit = defineEmits<{
  (e: "file-added", file: File): void;
}>();

const getFileExtension = (path: string) => {
  const basename = path.split(/[\\/]/).pop();
  const position = basename?.lastIndexOf(".") as number;
  if (basename === "" || position < 1) {
    return "";
  }
  return basename?.slice(position + 1);
};

const dragOver = ref(false);
const dragging = ref(false);
const inputRef = ref<HTMLInputElement | null>(null);

const onDragOver = () => {
  if (props.disabled || errorState.value) {
    return;
  }
  dragOver.value = true;
};

const onDragLeave = () => {
  dragOver.value = false;
};

const handleMouseLeave = () => {
  if (errorState.value) {
    errorState.value = false;
  }
};

const onDrop = (e: DragEvent) => {
  if (props.disabled || errorState.value) {
    return;
  }
  dragOver.value = false;

  const target = e.dataTransfer;

  if (target?.files) {
    Array.from(target.files).forEach((file) => {
      const extension = getFileExtension(file.name);
      if (props.supportedFormats?.includes(extension as string)) {
        emit("file-added", file);
      } else {
        errorState.value = true;
      }
    });
  }
};

const triggerInput = () => {
  if (inputRef.value) {
    inputRef.value.click();
  }
};

const onChange = (e: Event) => {
  if (props.disabled || errorState.value) {
    return;
  }

  const target = e.target as HTMLInputElement;
  if (target.files) {
    Array.from(target.files).forEach((file) => {
      emit("file-added", file);
    });
  }
};
const supportedFormatsText = computed(() =>
  props.supportedFormats?.length ? props.supportedFormats.join(", ") : "",
);
const icon = computed(() => (errorState.value ? CloseIcon : FilePlus));
</script>

<template>
  <div
    class="dropzone"
    :class="{
      'dropzone-active': dragging,
      'drag-over': dragOver,
      disable: props.disabled || errorState,
    }"
    @dragover.prevent="onDragOver"
    @dragleave="onDragLeave"
    @mouseleave="handleMouseLeave"
    @drop.prevent="onDrop"
  >
    <div class="dropzone-content">
      <slot name="icon">
        <Component :is="icon" class="dropzone-icon" />
      </slot>
      <div class="dropzone-info">
        <p class="dropzone-text">
          {{ props.labelText }}
        </p>
        <p class="dropzone-format">{{ supportedFormatsText }}</p>
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
    <input
      ref="inputRef"
      :disabled="props.disabled || errorState"
      type="file"
      hidden
      @change="onChange"
    />
  </div>
</template>

<style scoped lang="postcss">
@import url("@knime/styles/css/mixins.css");

.dropzone {
  background-color: var(--knime-gray-ultra-light);
  border: 2px dashed var(--knime-silver-sand-semi);
  width: 100%;
  border-radius: 12px;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  margin: 0 auto;
  display: flex;
  padding: var(--space-16) 0;
  flex-direction: column;
  gap: var(--space-12);

  &.disable {
    opacity: 0.5;
    cursor: not-allowed;
  }

  &:not(.disable) {
    &:hover {
      background-color: var(--knime-cornflower-semi);
    }

    &.dropzone-active {
      border-color: var(--knime-cornflower-semi);
    }

    &.drag-over {
      background-color: var(--knime-cornflower-semi);
    }

    &:focus-visible {
      outline: 3px solid var(--knime-focus-color);
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
      font-weight: 500;
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
