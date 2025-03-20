<script setup lang="ts">
import { type DownloadItem, DownloadProgressPanel } from "@knime/components";
import { ref } from "vue";

const isExpanded = ref(true);

const downloadItems: DownloadItem[] = [
  {
    name: "Important workflows",
    downloadId: "some-id",
    status: "READY",
  },
  {
    name: "My folder",
    downloadId: "some-id",
    status: "IN_PROGRESS",
  },
  {
    name: "Cool stuff",
    downloadId: "some-id",
    status: "CANCELLED",
    failureDetails: "Download was cancelled by user",
  },
  {
    name: "Other stuff",
    downloadId: "some-id",
    status: "FAILED",
    failureDetails: "We found a bug in the computer room",
  },
];
</script>
<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <DownloadProgressPanel v-model="isExpanded" :items="downloadItems" />
      </div>
    </div>
  </section>
</template>
