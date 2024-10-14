<script lang="ts" setup>
import ProgressItem from "../ProgressItem/ProgressItem.vue";
import { type State } from "../forms/FileUpload/FileUpload.vue";

type Props = {
  modelValue: {
    fileName: string;
    percentage: number;
    fileSize: number;
    status?: State;
    abortController?: AbortController;
  }[];
  compact?: boolean;
  scrollable: boolean;
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
      return { ...item, status: "error" };
    }
    return item;
  });
  emit("update:modelValue", modified);
};
</script>

<template>
  <div class="progress-wrapper" :class="{ scroll: props.scrollable }">
    <div v-for="(item, index) in modelValue" :key="index" class="item">
      <ProgressItem
        :file-name="item.fileName"
        :file-size="item.fileSize"
        :percentage="item.percentage"
        :status="item.status"
        @update:model-value="onRemove"
        @cancel="onCancel"
      />
    </div>
  </div>
</template>

<style scooped lang="postcss">
.progress-wrapper {
  width: 100%;
  height: 288px;
  font-size: 13px;
  font-weight: 600;
  color: var(--knime-masala);

  &.scroll {
    overflow: auto;
  }

  &::-webkit-scrollbar {
    width: 0;
    height: 0;
  }

  &::-moz-scrollbar {
    width: 0;
    height: 0;
  }

  scrollbar-width: none;

  & .item {
    display: flex;
    width: 100%;
    justify-content: space-between;
    flex-direction: column;
  }
}
</style>
