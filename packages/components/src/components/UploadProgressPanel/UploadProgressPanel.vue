<script setup lang="ts">
import { computed, toRef, watch } from "vue";

import CollapsiblePanel from "../CollapsiblePanel/CollapsiblePanel.vue";
import ProgressList from "../Progress/ProgressList/ProgressList.vue";

import UploadProgressPanelItem from "./UploadProgressPanelItem.vue";
import type { UploadItem } from "./types";

type Props = {
  items: UploadItem[];
  allowCancel?: boolean;
  allowRemove?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  allowRemove: true,
  allowCancel: true,
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

const hasSomeItemInProgress = computed(() =>
  props.items.some(({ status }) => status === "inprogress"),
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
  </CollapsiblePanel>
</template>

<style lang="postcss" scoped>
.upload-panel {
  width: 400px;
}
</style>
