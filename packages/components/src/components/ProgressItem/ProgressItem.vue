<script lang="ts" setup>
import { computed, ref } from "vue";
import { partial } from "filesize";

import CircleCheck from "@knime/styles/img/icons/circle-check.svg";
import CircleClose from "@knime/styles/img/icons/circle-close.svg";
import CloseIcon from "@knime/styles/img/icons/close.svg";
import fileIcon from "@knime/styles/img/icons/file.svg";
import TrashIcon from "@knime/styles/img/icons/trash.svg";
import { icons, isIconExisting } from "@knime/utils";

import truncateString from "../../../../utils/src/truncateString";
import FunctionButton from "../Buttons/FunctionButton.vue";
import LoadingIcon from "../LoadingIcon/LoadingIcon.vue";
import Pill from "../Pill/Pill.vue";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import { type State } from "../forms/FileUpload/FileUpload.vue";

/**
 * Represents the properties for the file upload component.
 * Contains details such as the file name, upload percentage, file size, and status and compact mode.
 */
type Props = {
  fileName: string;
  percentage: number;
  fileSize: number;
  status?: State;
  compact?: boolean;
};

const defineError = ref("Failed");

const statusMapper = computed(() => {
  return {
    info: ["Uploading", LoadingIcon],
    error: [defineError.value, CircleClose],
    success: ["Uploaded", CircleCheck],
    default: ["default", CircleCheck],
  };
});

const emit = defineEmits(["update:modelValue", "cancel"]);
const props = defineProps<Props>();

const getFileExtension = (path: string) => {
  // extract file name from full path (supports `\\` and `/` separators)
  const basename = path.split(/[\\/]/).pop();
  const pos = basename?.lastIndexOf(".") as number;
  if (basename === "" || pos < 1) {
    return "";
  }
  // extract extension ignoring `.`
  return basename?.slice(pos + 1);
};

const createPartial = () => {
  return partial({
    output: "string",
  });
};

const fileSizeFormat = computed(() => {
  const parsedSize = createPartial()(props.fileSize);
  return parsedSize;
});

const progressedFileSizeFormat = computed(() => {
  const partialFunc = createPartial();
  const parsedSize = partialFunc((props.fileSize / 100) * props.percentage);
  return parsedSize;
});

const icon = computed(() => {
  let candidate =
    `${getFileExtension(props.fileName)}Icon` as keyof typeof icons;
  return isIconExisting(candidate) ? icons[candidate] : fileIcon;
});

const onRemove = (index: string) => {
  emit("update:modelValue", index);
};
const onCancel = (index: string) => {
  defineError.value = "Cancelled";
  emit("cancel", index);
};
</script>

<template>
  <div class="progress-item">
    <div class="item-info">
      <Component :is="icon" class="file-type-icon" />
      <div ref="textDiv" class="item-name">
        <div class="file-name">{{ truncateString(fileName, 30) }}</div>
        <span class="file-size">
          {{ progressedFileSizeFormat }} of
          {{ fileSizeFormat }}
        </span>
      </div>
    </div>
    <div class="item-action">
      <Pill :variant="props.status || 'default'">
        <component :is="statusMapper[props.status || 'default']?.[1]" />
        {{ statusMapper[props.status || "default"]?.[0] }}
      </Pill>

      <FunctionButton
        v-if="percentage > 0 && percentage < 100 && props.status !== 'error'"
        @click="onCancel(fileName)"
      >
        <CloseIcon class="action-icon" />
      </FunctionButton>
      <FunctionButton v-else @click="onRemove(fileName)">
        <TrashIcon class="action-icon" />
      </FunctionButton>
    </div>
  </div>
  <div class="progress">
    <ProgressBar
      v-if="percentage < 100 && props.status !== 'error'"
      :percentage="percentage"
      :compact="true"
    />
  </div>
</template>

<style scoped lang="postcss">
@import url("@knime/styles/css/mixins.css");

.progress-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  gap: var(--space-16);
  border-top: 1px solid var(--knime-gray-light-semi);
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
}

& .item-info {
  display: flex;
  gap: var(--space-16);
  align-items: center;
  font-size: 13px;
  line-height: 14px;

  & .item-name {
    display: flex;
    flex-direction: column;
    gap: var(--space-4);

    & .file-name {
      white-space: nowrap;
      font-weight: 600;
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

  & .action-icon {
    stroke: var(--knime-dove-gray);

    @mixin svg-icon-size var(--icon-size);
  }
}

& .progress {
  padding: 6px;
}
</style>
