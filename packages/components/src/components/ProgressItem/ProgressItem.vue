<script lang="ts" setup>
import {
  type Component,
  type FunctionalComponent,
  type SVGAttributes,
  computed,
} from "vue";
import { partial } from "filesize";

import CircleCheck from "@knime/styles/img/icons/circle-check.svg";
import CircleClose from "@knime/styles/img/icons/circle-close.svg";
import Close from "@knime/styles/img/icons/close.svg";
import fileIcon from "@knime/styles/img/icons/file.svg";
import Trash from "@knime/styles/img/icons/trash.svg";
import { icons, isIconExisting } from "@knime/utils";

import truncateString from "../../../../utils/src/truncateString";
import FunctionButton from "../Buttons/FunctionButton.vue";
import LoadingIcon from "../LoadingIcon/LoadingIcon.vue";
import Pill from "../Pill/Pill.vue";
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import { type State } from "../forms/FileUpload/FileUpload.vue";

/**
 * Represents the supported file icons.
 * Can be one of "pdfIcon", "docxIcon", "xlsIcon", or "xlsxIcon" or by default "fileIcon".
 */
type SupportedFiles = "pdfIcon" | "docxIcon" | "xlsIcon" | "xlsxIcon";

/**
 * Describes the parsed file size object.
 * Contains detailed information about the file size, including value, unit, symbol, and exponent.
 */
type ParsedSize = {
  value: number;
  unit: string;
  symbol: string;
  exponent: number;
};
/**
 * Represents the properties for the file upload component.
 * Contains details such as the file name, upload percentage, file size, and status and compact mode.
 */
type Props = {
  fileName: string;
  percentage: number;
  fileSize: number;
  status: State;
  compact?: boolean;
};

const defineIcon: Record<string, SupportedFiles> = {
  pdf: "pdfIcon",
  docx: "docxIcon",
  xls: "xlsIcon",
  xlsx: "xlsxIcon",
};

const progressStatusMapper: Record<State, string> = {
  info: "Uploading",
  error: "Cancelled",
  success: "Uploaded",
};

const pillStatusMapper: Record<
  State,
  Component | FunctionalComponent<SVGAttributes>
> = {
  info: LoadingIcon,
  error: CircleClose,
  success: CircleCheck,
};

const emit = defineEmits(["update:modelValue", "cancel:model-value"]);
const props = defineProps<Props>();

const fleSizeFormat = computed(() => {
  const parsedSize = partial({
    output: "object",
  })(props.fileSize) as ParsedSize;
  return parsedSize;
});
const progressedFleSizeFormat = computed(() => {
  const parsedSize = partial({
    output: "object",
  })((props.fileSize / 100) * props.percentage) as ParsedSize;
  return parsedSize;
});

const icon = computed(() =>
  isIconExisting(defineIcon[props.fileName.split(".")[1]])
    ? icons[defineIcon[props.fileName.split(".")[1]]]
    : fileIcon,
);

const onRemove = (index: string) => {
  emit("update:modelValue", index);
};
const onCancel = (index: string) => {
  emit("cancel:model-value", index);
};
</script>

<template>
  <div class="progress-item">
    <div class="item-info">
      <Component :is="icon" class="ic" />
      <div ref="textDiv" class="item-name">
        <p>{{ truncateString(fileName, 30) }}</p>
        <p>
          {{ progressedFleSizeFormat.value }}
          {{ progressedFleSizeFormat.unit }} of {{ fleSizeFormat.value }}
          {{ fleSizeFormat.unit }}
        </p>
      </div>
    </div>
    <div class="item-action">
      <Pill :variant="props.status">
        <component :is="pillStatusMapper[props.status]" />
        {{ progressStatusMapper[props.status] }}
      </Pill>
      <FunctionButton>
        <Close
          v-if="percentage > 0 && percentage < 100"
          @click="onCancel(fileName)"
        />
        <Trash v-else @click="onRemove(fileName)" />
      </FunctionButton>
    </div>
  </div>
  <div class="progress">
    <ProgressBar
      v-if="percentage < 100"
      :percentage="percentage"
      :compact="true"
      :indeterminate="false"
    />
  </div>
</template>

<style scoped lang="postcss">
.progress-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 60px;
  width: 100%;
  gap: 16px;
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

& .ic {
  width: 24px;
  height: 24px;
}

& .item-info {
  display: flex;
  gap: 16px;
  align-items: center;
}

& .item-name {
  display: flex;
  flex-direction: column;
  gap: 4px;

  & p {
    margin: 0;
    white-space: nowrap;
  }

  & p:last-child {
    color: var(--knime-dove-gray);
    font-weight: 400;
  }
}

& .item-action {
  display: flex;
  align-items: center;
  gap: 8px;
}

/**
 */
& .progress {
  padding: 6px;
}
</style>
