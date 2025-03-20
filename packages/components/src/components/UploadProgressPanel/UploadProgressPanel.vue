<script setup lang="ts">
import { computed, toRef, watch } from "vue";

import CollapsiblePanel from "../CollapsiblePanel/CollapsiblePanel.vue";
import ProgressList from "../Progress/ProgressList/ProgressList.vue";
import SkeletonItem from "../SkeletonItem/SkeletonItem.vue";

import UploadProgressPanelItem from "./UploadProgressPanelItem.vue";
import type { UploadItem } from "./types";

type Props = {
  /**
   * List of items that the upload is comprised of
   */
  items: UploadItem[];
  /**
   * Whether each individual upload item can cancel the upload
   */
  allowCancel?: boolean;
  /**
   * Whether items can be removed individually after they've completed (or failed)
   * each upload
   */
  allowRemove?: boolean;
  /**
   * Indicates the number of items to show as placeholder skeletons
   */
  placeholderItems?: number;
};

const props = withDefaults(defineProps<Props>(), {
  allowRemove: true,
  allowCancel: true,
  placeholderItems: 0,
});

const emit = defineEmits<{
  remove: [item: UploadItem];
  cancel: [item: UploadItem];
  close: [];
}>();

const expanded = defineModel<boolean>("expanded", { default: true });

const totalItems = computed(() => props.items.length);
const uploadedItems = computed(
  () => props.items.filter(({ status }) => status === "complete").length,
);

const title = computed(
  () => `Uploaded ${uploadedItems.value} of ${totalItems.value} file(s)`,
);

const hasSomeItemInProgress = computed(
  () =>
    props.items.some(
      ({ status }) => status === "inprogress" || status === "processing",
    ) || props.placeholderItems > 0,
);

watch(toRef(props, "items"), (newItems, prevItems) => {
  // auto-close panel when the last item is removed
  if (prevItems?.length > 0 && newItems.length === 0) {
    emit("close");
  }
});
</script>

<template>
  <CollapsiblePanel
    v-model="expanded"
    :title="title"
    class="upload-panel"
    :closeable="!hasSomeItemInProgress"
    @close="emit('close')"
  >
    <div class="upload-panel-content">
      <ProgressList>
        <UploadProgressPanelItem
          v-for="item in items"
          :key="item.id"
          :item="item"
          :allow-cancel="allowCancel"
          :allow-remove="allowRemove"
          @remove="emit('remove', item)"
          @cancel="emit('cancel', item)"
        >
          <template #extra-actions>
            <slot name="extra-actions" />
          </template>
        </UploadProgressPanelItem>
      </ProgressList>
      <SkeletonItem
        :loading="placeholderItems > 0"
        height="59px"
        :repeat="placeholderItems"
        repeat-gap="1px"
      />
    </div>
  </CollapsiblePanel>
</template>

<style lang="postcss" scoped>
.upload-panel {
  width: 400px;
}

.upload-panel-content {
  max-height: 40vh;
  overflow-y: auto;
}
</style>
