<!-- <script lang="ts" setup>
import { computed } from "vue";

import ProgressItem, {
  FIXED_HEIGHT_ITEM,
} from "../ProgressItem/ProgressItem.vue";
import { type ProgressItemProps } from "../types";

type Prop = {
  /**
   * An array of items to display in the progress list.
   */
  list: ProgressItemProps[];
  /**
   * The maximum number of items to display at once.
   * If more items exist, the list will be scrollable.
   */
  maxDisplayedItems?: number;
};

const props = defineProps<Prop>();

const emit = defineEmits<{
  remove: [value: string];
  cancel: [value: string];
}>();

const onRemove = (id: string) => {
  emit("remove", id);
};
const onCancel = (id: string) => {
  emit("cancel", id);
};
const calcHeight = computed(() => {
  return (
    props.maxDisplayedItems &&
    `${props.maxDisplayedItems * FIXED_HEIGHT_ITEM}px`
  );
});
</script>

<template>
  <div class="progress-wrapper" :style="{ height: calcHeight }">
    <div v-for="item in list" :key="item.id" class="item">
      <ProgressItem
        :id="item.id"
        :title="item.fileName"
        :file-size="item.fileSize"
        :progress="item.percentage"
        :status="item.status"
        @remove="onRemove"
        @cancel="onCancel"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
.progress-wrapper {
  width: 100%;
  font-size: 13px;
  font-weight: 600;
  color: var(--knime-masala);
  overflow: auto;

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
</style> -->

<script setup lang="ts"></script>

<template>
  <div class="progress-list">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
.progress-list {
  &:deep(.progress-wrapper) {
    &:not(:first-child) {
      border-top: 1px solid var(--knime-porcelain);
    }
  }
}
</style>
