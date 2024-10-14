<script lang="ts" setup>
import ProgressItem from "../ProgressItem/ProgressItem.vue";
import { type State } from "../forms/FileUpload/FileUpload.vue";

type Props = {
  modelValue: {
    fileName: string;
    percentage: number;
    fileSize: number;
    status: State;
    abortController?: AbortController;
  }[];
  compact?: boolean;
};
const props = defineProps<Props>();
const emit = defineEmits(["update:modelValue"]);
const onRemove = (index: string) => {
  const updatedValues = [...props.modelValue];
  const modified = updatedValues.filter((item) => item.fileName !== index);
  emit("update:modelValue", modified);
};
const onCancel = (index: string) => {
  const updatedValues = [...props.modelValue];
  const modified = updatedValues.map((item) => {
    if (item.fileName === index) {
      item.abortController?.abort();
      return { ...item, percentage: 100, status: "error" };
    }
    return item;
  });
  emit("update:modelValue", modified);
};
</script>

<template>
  <div class="progress-wrapper">
    <div v-for="(item, index) in modelValue" :key="index" class="item">
      <ProgressItem
        :file-name="item.fileName"
        :file-size="item.fileSize"
        :percentage="item.percentage"
        :status="item.status"
        @update:model-value="onRemove"
        @cancel:model-value="onCancel"
      />
    </div>
  </div>
</template>

<style scooped lang="postcss">
.progress-wrapper {
  margin: 0 auto;
  width: 392px;
  height: 288px;
  padding: 8px;
  box-sizing: content-box;
  overflow: auto;
  font-size: 13px;
  font-weight: 600;
  color: var(--knime-masala);

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  & .item {
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-direction: column;
  }
}
</style>
