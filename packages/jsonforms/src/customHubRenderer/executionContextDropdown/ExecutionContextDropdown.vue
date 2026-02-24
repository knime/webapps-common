<script setup lang="ts">
import { computed } from "vue";

import { Dropdown } from "@knime/components";
import ExecutionContextSharedIcon from "@knime/styles/img/icons/execution-context-shared.svg";
import ServerRackWorkflowIcon from "@knime/styles/img/icons/server-rack-workflow.svg";
import SignWarningIcon from "@knime/styles/img/icons/sign-warning.svg";

import type { VueControlProps } from "../../higherOrderComponents";
import LabeledControl from "../../higherOrderComponents/control/LabeledControl.vue";

import {
  type ECStatusToClassKeyType,
  EXECUTION_CONTEXT_SHARED_STATUS,
  EXECUTION_CONTEXT_STATUS,
  EXECUTION_CONTEXT_STATUS_TO_CLASS,
} from "./executionContexts";

interface ExecutionContextSlotData {
  name: string;
  executorApVersion: string;
  shortExecutorApVersion: string;
  executionStatus: ECStatusToClassKeyType;
  autoStartEnabled: boolean;
  sharedStatus: string[];
}

interface ExecutionContextOption {
  const: string;
  title?: string;
  slotData?: ExecutionContextSlotData;
}

const props = defineProps<VueControlProps<string>>();

const possibleValues = computed(() => {
  const oneOf = props.control.schema.oneOf as
    | ExecutionContextOption[]
    | undefined;
  return (
    oneOf?.map(({ const: id, title, slotData }) => ({
      id,
      text: title ?? "",
      slotData,
    })) || []
  );
});

const modelValue = computed<string>({
  get: () => props.control.data ?? "",
  set: props.changeValue,
});

const formatExecutionStatus = ({
  executionStatus,
  autoStartEnabled,
}: {
  executionStatus: string;
  autoStartEnabled: boolean;
}) => {
  if (
    (executionStatus === EXECUTION_CONTEXT_STATUS.STOPPED ||
      executionStatus === EXECUTION_CONTEXT_STATUS.SHUTTING_DOWN) &&
    autoStartEnabled
  ) {
    return `${executionStatus} - Starts up on demand`;
  } else {
    return executionStatus;
  }
};
const getExecutionStatusClass = ({
  executionStatus,
}: {
  executionStatus: ECStatusToClassKeyType;
}) => {
  return (
    EXECUTION_CONTEXT_STATUS_TO_CLASS[executionStatus] ||
    EXECUTION_CONTEXT_STATUS_TO_CLASS.Unknown
  );
};
const getIcon = ({ sharedStatus }: { sharedStatus: string[] }) => {
  if (sharedStatus.includes(EXECUTION_CONTEXT_SHARED_STATUS.SHARED)) {
    return ExecutionContextSharedIcon;
  } else {
    return ServerRackWorkflowIcon;
  }
};
</script>

<template>
  <LabeledControl :label="control.label">
    <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
    <Dropdown
      v-model="modelValue"
      v-bind="$attrs"
      class="dropdown-input"
      :possible-values="possibleValues"
      :ariaLabel="control.label"
    >
      <template #option="{ slotData, isMissing, selectedValue }">
        <div v-if="isMissing" class="dropdown-item-wrapper">
          <SignWarningIcon class="missing" />
          <div class="main-content">
            <div class="title">(MISSING) {{ selectedValue }}</div>
            <div class="run-status">Execution context not found.</div>
          </div>
        </div>
        <div v-else class="dropdown-item-wrapper slot-option">
          <Component :is="getIcon({ sharedStatus: slotData.sharedStatus })" />
          <div class="main-content">
            <div class="title">
              <span :title="slotData.name">{{ slotData.name }}</span>
              <span :title="slotData.executorApVersion">{{
                slotData.shortExecutorApVersion
              }}</span>
            </div>
            <div class="run-status">
              <div
                class="dot"
                :class="{
                  [getExecutionStatusClass({
                    executionStatus: slotData.executionStatus,
                  })]: true,
                }"
              />
              <div>
                {{
                  formatExecutionStatus({
                    executionStatus: slotData.executionStatus,
                    autoStartEnabled: slotData.autoStartEnabled,
                  })
                }}
              </div>
            </div>
          </div>
          <div class="shared-status">
            {{ slotData.sharedStatus.join(", ") }}
          </div>
        </div>
      </template>
    </Dropdown>
  </LabeledControl>
</template>

<style scoped>
.dropdown-input {
  --dropdown-max-height: calc(58px * 5); /* show 5 items per default */

  & :deep([role="button"]) {
    border: var(--kds-border-action-input);
    border-radius: var(--kds-border-radius-container-0-37x);
  }
}

.dropdown-item-wrapper {
  display: flex;
  flex-direction: row;
  gap: 10px;
  width: 100%;
  padding: 10px 0;
  font-family: Roboto, sans-serif;

  & > svg {
    flex: 0 0 16px;
    height: 16px;
    stroke-width: 1.3px;
  }
}

.main-content {
  display: flex;
  flex-grow: 1;
  flex-direction: column;
  overflow: hidden;
}

.run-status {
  display: flex;
  flex-direction: row;
  gap: 5px;
  align-items: center;
  justify-content: left;
  font-size: 11px;
  font-weight: 300;
  line-height: 16.5px;

  & .dot {
    width: 4px;
    height: 4px;
    content: "";
    border-radius: 50%;

    &.status-running {
      background-color: var(--knime-meadow);
    }

    &.status-starting-up,
    &.status-shutting-down,
    &.status-updating,
    &.status-processing,
    &.status-at-full-capacity {
      background-color: var(--knime-carrot);
    }

    &.status-stopped {
      background-color: var(--knime-coral-dark);
    }

    &.status-unknown {
      background-color: var(--knime-silver-sand);
    }
  }
}

.title {
  display: flex;
  align-items: baseline;
  margin-bottom: var(--space-4);
}

.title span:nth-child(1) {
  flex: 0 1 auto;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.title span:nth-child(2) {
  flex: 0 0 auto;
  padding-left: var(--space-8);
  font-size: 11px;
  font-weight: 300;
  line-height: 14.3px;
}

.title span:first-child,
.shared-status {
  font-size: 13px;
  font-weight: 500;
  line-height: 16.9px;
}
</style>
