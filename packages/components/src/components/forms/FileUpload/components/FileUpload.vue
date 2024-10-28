<script lang="ts" setup>
import Label from "../../Label/Label.vue";
import { type FileUploadProps, type List } from "../types";

import Dropzone from "./Dropzone.vue";
import ProgressList from "./ProgressList.vue";

const props = defineProps<FileUploadProps>();

const emit = defineEmits<{
  (e: "update:modelValue", value: List[]): void;
  (e: "file-added", file: File): void;
}>();

const onRemove = (index: string) => {
  const updatedValues = [...props.modelValue];
  const modified = updatedValues.filter((item) => item.fileName !== index);
  emit("update:modelValue", modified);
};
const onCancel = (index: string) => {
  const updatedValues = [...props.modelValue];
  const modified: List[] = updatedValues.map((item) => {
    if (item.fileName === index) {
      item.abortController?.abort();
      return { ...item, status: "cancelled" };
    }
    return item;
  });
  emit("update:modelValue", modified);
};
</script>

<template>
  <div class="file-upload-widget">
    <Label :text="label" large>
      <Dropzone
        :label-text="props.labelText"
        :supported-formats="props.supportedFormats"
        :disabled="props.disabled"
        @file-added="(file) => emit('file-added', file)"
      />
    </Label>
  </div>
  <div class="list">
    <ProgressList
      :list="props.modelValue"
      :number-of-visible-items="props.numberOfVisibleItems"
      @remove="onRemove"
      @cancel="onCancel"
    />
  </div>
</template>

<style scoped lang="postcss">
@import url("@knime/styles/css/mixins.css");

.file-upload-widget {
  width: 406px;
  margin: 0 auto;
}

.list {
  margin: 0 auto;
  width: 392px;
  padding: 8px 16px 16px;
  box-sizing: content-box;
}
</style>
