<script setup lang="ts">
import { ref } from "vue";

import {
  FunctionButton,
  type UploadItem,
  UploadProgressPanel,
} from "@knime/components";
import ActivityIcon from "@knime/styles/img/icons/activity.svg";

const isExpanded = ref(true);

const mockData: UploadItem[] = [
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
  {
    id: "5",
    name: "document.docx",
    progress: 100,
    size: 200_000,
    status: "complete",
  },
  {
    id: "6",
    name: "slides.pptx",
    progress: 20,
    size: 200_000,
    status: "failed",
  },
];
</script>

<template>
  <section>
    <div class="grid-container">
      <div class="grid-item-12">
        <UploadProgressPanel v-model="isExpanded" :items="mockData">
          <template #extra-actions>
            <FunctionButton>
              <ActivityIcon />
            </FunctionButton>
          </template>
        </UploadProgressPanel>
      </div>
    </div>
  </section>
</template>

<style lang="postcss" scoped></style>
