<script lang="ts" setup>
import { computed } from "vue";

import { type ProgressItemProps } from "../types";

import ProgressItem from "./ProgressItem.vue";

type Prop = {
  list: ProgressItemProps[];
  scrollable?: number;
};

const props = defineProps<Prop>();
const emit = defineEmits(["remove", "cancel"]);

const FIXED_HEIGHT_ITEM = 72;

const onRemove = (fileName: string) => {
  emit("remove", fileName);
};

const onCancel = (fileName: string) => {
  emit("cancel", fileName);
};

const calcHeight = computed(() => {
  return props.scrollable
    ? `${props.scrollable * FIXED_HEIGHT_ITEM}px`
    : "auto";
});
</script>

<template>
  <div class="progress-wrapper" :style="{ height: calcHeight }">
    <div v-for="(item, index) in list" :key="index" class="item">
      <ProgressItem
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
