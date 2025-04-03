<script setup lang="ts">
import { type Component, computed } from "vue";

import CircleCheck from "@knime/styles/img/icons/circle-check.svg";
import CircleClose from "@knime/styles/img/icons/circle-close.svg";
import CloseIcon from "@knime/styles/img/icons/close.svg";
import DownloadIcon from "@knime/styles/img/icons/cloud-download.svg";
import KnarFileIcon from "@knime/styles/img/icons/file-knar.svg";
import TrashIcon from "@knime/styles/img/icons/trash.svg";

import FunctionButton from "../Buttons/FunctionButton.vue";
import LoadingIcon from "../LoadingIcon/LoadingIcon.vue";
import type { PillVariant } from "../Pill/Pill.vue";
import ProgressItem from "../Progress/ProgressItem/ProgressItem.vue";

import type { DownloadItem } from "./types";

type Props = {
  item: DownloadItem;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  remove: [];
  cancel: [];
  download: [];
}>();

const statusMapper = {
  IN_PROGRESS: ["Zipping", "info", LoadingIcon],
  READY: ["Ready", "success", CircleCheck],
  CANCELLED: ["Cancelled", "error", CircleClose],
  FAILED: ["Failed", "error", CircleClose],
} satisfies Record<DownloadItem["status"], [string, PillVariant, Component]>;

const statusPill = computed(() => {
  const [text, variant, icon] = statusMapper[props.item.status];
  const hasFailureDetails =
    (props.item.status === "FAILED" || props.item.status === "CANCELLED") &&
    props.item.failureDetails;

  return {
    text,
    variant,
    icon,
    ...(hasFailureDetails && { tooltip: props.item.failureDetails }),
  };
});

const isCancellable = computed(() => props.item.status === "IN_PROGRESS");
const isReady = computed(() => props.item.status === "READY");
const isRemovable = computed(
  () =>
    props.item.status === "CANCELLED" ||
    props.item.status === "FAILED" ||
    props.item.status === "READY",
);
</script>

<template>
  <ProgressItem
    :id="item.downloadId"
    :title="item.name"
    :status-pill="statusPill"
  >
    <template #prepend>
      <KnarFileIcon />
    </template>

    <template #actions>
      <FunctionButton
        v-if="isCancellable"
        data-test-id="cancel-action"
        title="Cancel download"
        @click="emit('cancel')"
      >
        <CloseIcon class="action-icon" />
      </FunctionButton>

      <FunctionButton
        v-if="isReady"
        data-test-id="download-action"
        title="Download item again"
        @click="emit('download')"
      >
        <DownloadIcon class="action-icon" />
      </FunctionButton>

      <FunctionButton
        v-if="isRemovable"
        data-test-id="remove-action"
        title="Remove item"
        @click="emit('remove')"
      >
        <TrashIcon class="action-icon" />
      </FunctionButton>
    </template>
  </ProgressItem>
</template>
