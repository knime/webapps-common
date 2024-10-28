<script lang="ts" setup>
import { computed } from "vue";

import { type ProgressItemProps } from "../types";

import ProgressItem, { FIXED_HEIGHT_ITEM } from "./ProgressItem.vue";

type Prop = {
  list: ProgressItemProps[];
  numberOfVisibleItems?: number;
};

const props = defineProps<Prop>();
const emit = defineEmits(["remove", "cancel"]);

const onRemove = (fileName: string) => {
  emit("remove", fileName);
};

const onCancel = (fileName: string) => {
  emit("cancel", fileName);
};

const calcHeight = computed(() => {
  return (
    props.numberOfVisibleItems &&
    `${props.numberOfVisibleItems * FIXED_HEIGHT_ITEM}px`
  );
});
</script>

<template>
  <div class="progress-wrapper" :style="{ height: calcHeight }">
    <div v-for="item in list" :key="item.id" class="item">
      <ProgressItem
        :id="item.id"
        :file-name="item.fileName"
        :file-size="item.fileSize"
        :percentage="item.percentage"
        :status="item.status"
        @remove="onRemove(item.fileName)"
        @cancel="onCancel(item.fileName)"
      />
    </div>
  </div>
</template>

<style scooped lang="postcss">
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
</style>
