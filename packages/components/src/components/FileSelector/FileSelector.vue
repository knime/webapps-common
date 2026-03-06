<script setup lang="ts">
import { computed, getCurrentInstance, ref } from "vue";

import LensIcon from "@knime/styles/img/icons/lens.svg";

import Button from "../Buttons/Button.vue";

export interface FileSelectorProps {
  modelValue?: File[] | null;
  label?: string;
  acceptedFileTypes?: string;
  multiple?: boolean;
}

const props = withDefaults(defineProps<FileSelectorProps>(), {
  modelValue: null,
  label: "",
  acceptedFileTypes: "*",
  multiple: false,
});

const emit = defineEmits<{
  "update:modelValue": [files: File[]];
}>();

const fileSelector = ref<HTMLInputElement | null>(null);

const displayedFilename = computed(() => {
  return (
    props.modelValue?.map?.(({ name }) => name).join(", ") || "No file selected"
  );
});

const fileSelectorId = computed(() => {
  const uid = getCurrentInstance()?.uid;
  return `file-selector-${uid}`;
});

const selectFileText = computed(() => {
  return `Select file${props.multiple ? "s" : ""}`;
});

const openFileSelector = () => {
  fileSelector.value?.click();
};

const onSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    emit("update:modelValue", Array.from(target.files));
  }
};
</script>

<template>
  <div class="wrapper">
    <label :for="fileSelectorId">
      <Button :compact="true" :with-border="true" @click="openFileSelector">
        <LensIcon />{{ selectFileText }}
      </Button>
      <span class="filename">{{ displayedFilename }}</span>
    </label>
    <input
      :id="fileSelectorId"
      ref="fileSelector"
      :aria-label="label"
      type="file"
      :accept="acceptedFileTypes"
      :multiple="multiple"
      hidden
      @input="(event) => onSelect(event)"
    />
  </div>
</template>

<style lang="postcss" scoped>
.filename {
  margin-left: 10px;
  font: var(--kds-font-base-title-small);
  color: var(--kds-color-text-and-icon-subtle);
}
</style>
