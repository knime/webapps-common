<script setup lang="ts">
import { computed, watch } from "vue";

import CollapsiblePanel from "../CollapsiblePanel/CollapsiblePanel.vue";
import ProgressList from "../Progress/ProgressList/ProgressList.vue";

import DownloadProgressPanelItem from "./DownloadProgressPanelItem.vue";
import type { DownloadItem } from "./types";

type Props = {
  /**
   * List of current download items that should be displayed
   */
  items: DownloadItem[];
};
const props = defineProps<Props>();

const emit = defineEmits<{
  remove: [item: DownloadItem];
  cancel: [item: DownloadItem];
  download: [item: DownloadItem];
  close: [];
}>();

const expanded = defineModel<boolean>("expanded", { default: true });

const totalItems = computed(() => props.items.length);
const totalDownloadedItems = computed(
  () => props.items.filter(({ status }) => status === "READY").length,
);
const title = computed(
  () =>
    `Downloaded ${totalDownloadedItems.value} of ${totalItems.value} file(s)`,
);
const hasItemsInProgress = computed(() =>
  props.items.some(({ status }) => status === "IN_PROGRESS"),
);

watch(
  () => props.items?.length,
  (newValue, oldValue) => {
    if (oldValue > 0 && !newValue) {
      emit("close");
    }
  },
);
</script>

<template>
  <CollapsiblePanel
    v-model="expanded"
    :title="title"
    class="download-panel"
    :closeable="!hasItemsInProgress"
    @close="emit('close')"
  >
    <div class="download-panel-content">
      <ProgressList>
        <DownloadProgressPanelItem
          v-for="item in items"
          :key="item.downloadId"
          :item="item"
          @remove="emit('remove', item)"
          @cancel="emit('cancel', item)"
          @download="emit('download', item)"
        />
      </ProgressList>
    </div>
  </CollapsiblePanel>
</template>

<style lang="postcss" scoped>
.download-panel {
  width: 400px;
}

.download-panel-content {
  max-height: 40vh;
  overflow-y: auto;
}
</style>
