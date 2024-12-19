<script setup lang="ts">
import { type Component, computed } from "vue";
import { toRef } from "vue";

import CircleCheck from "@knime/styles/img/icons/circle-check.svg";
import CircleClose from "@knime/styles/img/icons/circle-close.svg";
import CloseIcon from "@knime/styles/img/icons/close.svg";
import TrashIcon from "@knime/styles/img/icons/trash.svg";

import { useFileIcon } from "../../composables/useFileIcons";
import { useFileSizeFormatting } from "../../composables/useFileSizeFormatting";
import FunctionButton from "../Buttons/FunctionButton.vue";
import LoadingIcon from "../LoadingIcon/LoadingIcon.vue";
import type { PillVariant } from "../Pill/Pill.vue";
import ProgressItem from "../Progress/ProgressItem/ProgressItem.vue";

import type { UploadItem, UploadItemStatus } from "./types";

type Props = {
  item: UploadItem;
  allowCancel: boolean;
  allowRemove: boolean;
  allowDelete?: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  remove: [];
  cancel: [];
}>();

const { icon } = useFileIcon({ filename: toRef(props.item, "name") });
const { formattedSize } = useFileSizeFormatting({
  size: toRef(props.item, "size"),
});

const { formattedSize: progressedFileSizeFormat } = useFileSizeFormatting({
  size: computed(() => (props.item.size / 100) * (props.item.progress ?? 0)),
});

const subtitle = computed(() =>
  props.item.status === "inprogress"
    ? `${progressedFileSizeFormat.value} of ${formattedSize.value}`
    : `${formattedSize.value}`,
);

const statusMapper = {
  inprogress: ["Uploading", "info", LoadingIcon],
  failed: ["Failed", "error", CircleClose],
  complete: ["Uploaded", "success", CircleCheck],
  cancelled: ["Cancelled", "error", CircleClose],
  processing: ["Processing", "info", LoadingIcon],
} satisfies Record<UploadItemStatus, [string, PillVariant, Component]>;

type StatusPill =
  | InstanceType<typeof ProgressItem>["$props"]["statusPill"]
  | null;
const statusPill = computed<StatusPill>(() => {
  if (!props.item.status) {
    return null;
  }

  const [text, variant, icon] = statusMapper[props.item.status];

  const isFailed = props.item.status === "failed";
  const tooltip =
    isFailed && props.item.failureDetails
      ? props.item.failureDetails
      : // eslint-disable-next-line no-undefined
        undefined;

  return { text, variant, icon, tooltip } satisfies StatusPill;
});

const shouldShowCancelAction = computed(
  () => props.allowCancel && props.item.status === "inprogress",
);

const shouldShowRemoveAction = computed(() => {
  const allowedRemoveStatuses: UploadItemStatus[] = ["failed", "cancelled"];
  const allowedDeleteStatuses: UploadItemStatus[] = ["complete"];
  const showRemove =
    props.allowRemove &&
    props.item.status &&
    allowedRemoveStatuses.includes(props.item.status);
  const showDelete =
    props.allowDelete &&
    (!props.item.status || allowedDeleteStatuses.includes(props.item.status));
  return showRemove || showDelete;
});
</script>

<template>
  <ProgressItem
    :id="item.id"
    :title="item.name"
    :subtitle="subtitle"
    :progress="item.progress"
    v-bind="props.item.status ? { 'status-pill': statusPill } : {}"
  >
    <template #prepend>
      <Component :is="icon" />
    </template>

    <template #actions>
      <slot name="extra-actions" />

      <FunctionButton
        v-if="shouldShowCancelAction"
        data-test-id="cancel-action"
        @click="emit('cancel')"
      >
        <CloseIcon class="action-icon" />
      </FunctionButton>

      <FunctionButton
        v-if="shouldShowRemoveAction"
        data-test-id="remove-action"
        @click="emit('remove')"
      >
        <TrashIcon class="action-icon" />
      </FunctionButton>
    </template>
  </ProgressItem>
</template>
