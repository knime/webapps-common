<script lang="ts" setup>
import ProgressBar from "../ProgressBar/ProgressBar.vue";
import StatusPill from "../StatusPill/StatusPill.vue";
import filePlus from "@knime/styles/img/icons/file.svg";
import Close from "@knime/styles/img/icons/close.svg";
import CircleClose from "@knime/styles/img/icons/circle-close.svg";
import Trash from "@knime/styles/img/icons/trash.svg";
import CircleCheck from "@knime/styles/img/icons/circle-check.svg";
import Reload from "@knime/styles/img/icons/reload.svg";
import FunctionButton from "../Buttons/FunctionButton.vue";
import truncateString from "../../../../utils/src/truncateString";
import { computed, type FunctionalComponent, type SVGAttributes } from "vue";
import { partial } from "filesize";

type State = "Info" | "Error" | "Success";

type ParsedSize = {
  value: number;
  unit: string;
  symbol: string;
  exponent: number;
};
type Props = {
  fileName: string;
  percentage: number;
  fileSize: number;
  status: State;
  compact?: boolean;
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

const icon = computed(() => filePlus);

const progressStatus = computed(() => {
  const mapper: Record<State, string> = {
    Info: "Uploading",
    Error: "Cancelled",
    Success: "Uploaded",
  };

  return mapper[props.status];
});

const pillStatus = computed(() => {
  const mapper: Record<State, FunctionalComponent<SVGAttributes>> = {
    Info: Reload,
    Error: CircleClose,
    Success: CircleCheck,
  };
  return mapper[props.status];
});

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
      <StatusPill :state="status">
        <component :is="pillStatus" />
        {{ progressStatus }}
      </StatusPill>
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
