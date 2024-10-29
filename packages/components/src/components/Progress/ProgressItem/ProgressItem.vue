<script lang="ts">
export const FIXED_HEIGHT_ITEM = 60;
</script>

<script lang="ts" setup>
import { computed } from "vue";
import { partial } from "filesize";

import CircleCheck from "@knime/styles/img/icons/circle-check.svg";
import CircleClose from "@knime/styles/img/icons/circle-close.svg";
import CloseIcon from "@knime/styles/img/icons/close.svg";
import FilePlusIcon from "@knime/styles/img/icons/file.svg";
import TrashIcon from "@knime/styles/img/icons/trash.svg";
import { icons, isIconExisting } from "@knime/utils";

import FunctionButton from "../../Buttons/FunctionButton.vue";
import LoadingIcon from "../../LoadingIcon/LoadingIcon.vue";
import Pill from "../../Pill/Pill.vue";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import { type ProgressItemProps } from "../types";

const statusMapper = computed(() => {
  return {
    info: ["Uploading", LoadingIcon],
    error: ["Failed", CircleClose],
    success: ["Uploaded", CircleCheck],
    cancelled: ["Cancelled", CircleClose],
  };
});
const emit = defineEmits<{
  remove: [value: string];
  cancel: [value: string];
}>();
const props = defineProps<ProgressItemProps>();
const getFileExtension = (path: string) => {
  const basename = path.split(/[\\/]/).pop();
  const position = basename?.lastIndexOf(".") as number;
  if (basename === "" || position < 1) {
    return "";
  }
  return basename?.slice(position + 1);
};
const formatSize = partial({
  output: "string",
});
const fileSizeFormat = computed(() => {
  const parsedSize = formatSize(props.fileSize);
  return parsedSize;
});
const progressedFileSizeFormat = computed(() => {
  const parsedSize = formatSize(
    ((props.fileSize as number) / 100) * (props?.percentage as number),
  );
  return parsedSize;
});
const isProgressing = computed(() => {
  return (
    (props.percentage as number) < 100 &&
    props.status !== "error" &&
    props.status !== "cancelled"
  );
});
const icon = computed(() => {
  let candidate =
    `${getFileExtension(props.fileName)}Icon` as keyof typeof icons;
  return isIconExisting(candidate) ? icons[candidate] : FilePlusIcon;
});
const onRemove = (id: string) => {
  emit("remove", id);
};
const onCancel = (id: string) => {
  emit("cancel", id);
};
</script>

<template>
  <div class="progress-wrapper" :style="{ height: `${FIXED_HEIGHT_ITEM}px` }">
    <div class="progress-item">
      <div class="item-info">
        <Component :is="icon" class="file-type-icon" />
        <div ref="textDiv" class="item-name">
          <div class="file-name" :title="props.fileName">
            {{ props.fileName }}
          </div>
          <span class="file-size">
            {{ progressedFileSizeFormat }} of {{ fileSizeFormat }}
          </span>
        </div>
      </div>
      <div class="item-action">
        <Pill
          v-if="props.status"
          :variant="props.status === 'cancelled' ? 'error' : props.status"
        >
          <component :is="statusMapper[props.status][1]" />
          {{ statusMapper[props.status][0] }}
        </Pill>
        <FunctionButton v-if="isProgressing" @click="onCancel(id)">
          <CloseIcon class="action-icon" />
        </FunctionButton>
        <FunctionButton v-else @click="onRemove(id)">
          <TrashIcon class="action-icon" />
        </FunctionButton>
      </div>
    </div>
    <div class="progress">
      <ProgressBar
        v-if="isProgressing"
        :percentage="percentage"
        :compact="true"
      />
    </div>
  </div>
</template>

<style scoped lang="postcss">
@import url("@knime/styles/css/mixins.css");

.progress-wrapper {
  display: flex;
  flex-direction: column;
}

& .progress-item {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  gap: var(--space-16);
  border-top: 1px solid var(--knime-gray-light-semi);
}

& .progress {
  padding: 8px;
}

& .item:first-child .progress-item {
  border: none;
}

& .item .icon {
  display: flex;
  justify-content: center;
  align-items: center;
}

& .file-type-icon {
  @mixin svg-icon-size 24;

  flex-shrink: 0;
}

& .item-info {
  display: flex;
  align-items: center;
  gap: var(--space-16);
  font-size: 13px;
  line-height: 14px;
  flex-grow: 1;
  overflow: hidden;

  & .item-name {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);
    flex-grow: 1;
    overflow: hidden;

    & .file-name {
      white-space: nowrap;
      font-weight: 700;
      overflow: hidden;
      text-overflow: ellipsis;
      max-width: 100%;
    }

    & .file-size {
      color: var(--knime-dove-gray);
      font-weight: 400;
    }
  }
}

& .item-action {
  display: flex;
  align-items: center;
  gap: var(--space-8);
  font-weight: 500;
  font-size: 13px;
  line-height: 13px;
  flex-shrink: 0;

  & .action-icon {
    stroke: var(--knime-dove-gray);
  }
}
</style>
