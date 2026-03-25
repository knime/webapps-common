<script setup lang="ts">
import { computed, ref } from "vue";
import { cloneDeep } from "lodash-es";

import { KdsButton } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<VueControlPropsForLabelContent<Array<File>>>();

const files = ref(cloneDeep(props.control.data));

const acceptedFileTypes = computed(
  () => props.control.uischema.options?.accept ?? "*",
);

const multiple = computed(
  () => props.control.uischema.options?.multiple ?? false,
);

const fileSelector = ref<HTMLInputElement | null>(null);

const displayedFilename = computed(() => {
  return (
    files.value?.map?.(({ name }) => name).join(", ") || "No file selected"
  );
});

const selectFileText = computed(() => {
  return `Select file${multiple.value ? "s" : ""}`;
});

const openFileSelector = () => {
  fileSelector.value?.click();
};

const onSelect = (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (target.files) {
    files.value = Array.from(target.files);
    props.handleChange(props.control.path, Array.from(files.value));
  }
};
</script>

<template>
  <div class="wrapper">
    <KdsButton
      class="file-select-button"
      :label="selectFileText"
      leading-icon="search"
      variant="outlined"
      :disabled="disabled"
      @click="openFileSelector"
    />
    <span class="filename">{{ displayedFilename }}</span>
    <input
      :id="labelForId"
      ref="fileSelector"
      :aria-label="control.label"
      type="file"
      :accept="acceptedFileTypes"
      :multiple="multiple"
      :disabled="disabled"
      hidden
      @change="onSelect"
    />
  </div>
</template>

<style lang="postcss" scoped>
.file-select-button {
  display: inline;
}

.filename {
  margin-left: 10px;
  font: var(--kds-font-base-title-small);
  color: var(--kds-color-text-and-icon-subtle);
}
</style>
