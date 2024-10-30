<script lang="ts" setup>
import Label from "../../Label/Label.vue";
import { type FileUploadProps, type ProgressItemProps } from "../types";

import Dropzone from "./Dropzone.vue";
import ProgressList from "./ProgressList.vue";

const props = defineProps<FileUploadProps>();

const emit = defineEmits<{
  (e: "update:modelValue", value: ProgressItemProps[]): void;
  (e: "file-added", file: File): void;
  (e: "cancel-upload", id: string): void;
}>();

const onRemove = (id: string) => {
  const updatedValues = [...props.modelValue];
  const modified = updatedValues.filter((item) => item.id !== id);
  emit("update:modelValue", modified);
};

const onCancel = (id: string) => {
  emit("cancel-upload", id);
};
</script>

<template>
  <div class="file-upload-widget">
    <Label :text="label" large>
      <Dropzone
        :label-text="props.labelText"
        :supported-formats="props.supportedFormats as string[]"
        :disabled="props.disabled"
        @file-added="(file) => emit('file-added', file)"
      />
    </Label>
  </div>
  <div class="list">
    <ProgressList
      :list="props.modelValue"
      :max-displayed-items="props.maxDisplayedItems"
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
