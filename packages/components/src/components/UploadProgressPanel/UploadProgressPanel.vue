<script setup lang="ts">
import CollapsiblePanel from "../CollapsiblePanel/CollapsiblePanel.vue";
import ProgressList from "../Progress/ProgressList/ProgressList.vue";

import UploadProgressPanelItem from "./UploadProgressPanelItem.vue";
import type { UploadProgressItem } from "./types";

type Props = {
  items: UploadProgressItem[];
  allowCancel?: boolean;
  allowRemove?: boolean;
};

withDefaults(defineProps<Props>(), {
  allowRemove: true,
  allowCancel: true,
});
</script>

<template>
  <CollapsiblePanel title="Upload panel">
    <ProgressList>
      <UploadProgressPanelItem
        v-for="item in items"
        :key="item.id"
        :item="item"
        :allow-cancel="allowCancel"
        :allow-remove="allowRemove"
      >
        <template #extra-actions>
          <slot name="extra-actions" />
        </template>
      </UploadProgressPanelItem>
    </ProgressList>
  </CollapsiblePanel>
</template>

<style lang="postcss" scoped></style>
