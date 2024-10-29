<script setup lang="ts">
import { ref } from "vue";

import {
  type UploadProgressItem,
  UploadProgressPanel,
} from "@knime/components";

const isExpanded = ref(true);

const mockData: UploadProgressItem[] = [
  {
    id: "1",
    name: "Hello world.txt",
    progress: 40,
    size: 500_000,
    status: "inprogress",
  },
  {
    id: "2",
    name: "video.mp4",
    progress: 20,
    size: 1_500_000,
    status: "inprogress",
  },
  {
    id: "3",
    name: "document.csv",
    progress: 87,
    size: 200_000,
    status: "inprogress",
  },
  {
    id: "4",
    name: "document.csv",
    progress: 40,
    size: 200_000,
    status: "cancelled",
  },
  { id: "5", name: "document.csv", size: 200_000, status: "complete" },
  { id: "6", name: "document.csv", size: 200_000, status: "failed" },
];
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <UploadProgressPanel v-model="isExpanded" :items="mockData" />
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped></style>
