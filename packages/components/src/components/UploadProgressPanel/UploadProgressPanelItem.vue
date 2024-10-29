<script setup lang="ts">
import { computed } from "vue";
import { partial } from "filesize";

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

import type { UploadProgressItem, UploadProgressItemStatus } from "./types";

type Props = {
  item: UploadProgressItem;
  allowCancel: boolean;
  allowRemove: boolean;
};

const props = defineProps<Props>();

const emit = defineEmits<{
  remove: [];
  cancel: [];
}>();

const name = computed(() => props.item.name);
const size = computed(() => props.item.size);

const { icon } = useFileIcon({ filename: name });
const { formattedSize } = useFileSizeFormatting({ size });

const formatSize = partial({
  output: "string",
});

const progressedFileSizeFormat = computed(() => {
  const parsedSize = formatSize(
    (size.value / 100) * (props.item.progress ?? 0),
  );
  return parsedSize;
});

const subtitle = computed(
  () => `${progressedFileSizeFormat.value} of ${formattedSize.value}`,
);

const statusMapper = computed(() => {
  return {
    inprogress: ["Uploading", "info", LoadingIcon],
    failed: ["Failed", "error", CircleClose],
    complete: ["Uploaded", "success", CircleCheck],
    cancelled: ["Cancelled", "error", CircleClose],
  } satisfies Record<UploadProgressItemStatus, [string, PillVariant, any]>;
});

const statusPill = computed(() => {
  const [text, variant, icon] = statusMapper.value[props.item.status];

  return { text, variant, icon };
});

const shouldShowCancelAction = computed(
  () => props.allowCancel && props.item.status === "inprogress",
);

const shouldShowRemoveAction = computed(() => {
  const allowedStatuses: UploadProgressItemStatus[] = ["failed", "cancelled"];
  return props.allowRemove && allowedStatuses.includes(props.item.status);
});
</script>

<template>
  <ProgressItem
    :id="item.id"
    :title="item.name"
    :subtitle="subtitle"
    :progress="item.progress"
    :status-pill="statusPill"
  >
    <template #prepend>
      <Component :is="icon" />
    </template>

    <template #actions>
      <slot name="extra-actions" />

      <FunctionButton v-if="shouldShowCancelAction" @click="emit('cancel')">
        <CloseIcon class="action-icon" />
      </FunctionButton>

      <FunctionButton v-if="shouldShowRemoveAction" @click="emit('remove')">
        <TrashIcon class="action-icon" />
      </FunctionButton>
    </template>
  </ProgressItem>
</template>

<style lang="postcss" scoped></style>
