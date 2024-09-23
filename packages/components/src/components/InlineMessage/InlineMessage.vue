<script setup lang="ts">
import CircleInfoIcon from "@knime/styles/img/icons/circle-info.svg";
import SignWarningIcon from "@knime/styles/img/icons/sign-warning.svg";
import CircleCloseIcon from "@knime/styles/img/icons/circle-close.svg";
import CircleCheckIcon from "@knime/styles/img/icons/circle-check.svg";
import RocketIcon from "@knime/styles/img/icons/rocket.svg";

type InlineMessageType = "info" | "warning" | "error" | "success" | "promotion";

const TYPE_ICON_MAP = {
  info: CircleInfoIcon,
  warning: SignWarningIcon,
  error: CircleCloseIcon,
  success: CircleCheckIcon,
  promotion: RocketIcon,
};

defineProps<{
  type: InlineMessageType;
  title: string;
  description: string;
}>();
</script>

<template>
  <div :class="['inline-message', type]">
    <component :is="TYPE_ICON_MAP[type]" class="icon" />
    <span class="title">{{ title }}</span>
    <span class="description">{{ description }}</span>
  </div>
</template>

<style lang="postcss" scoped>
.inline-message {
  font-size: 12px;
  line-height: 14px;
  display: grid;
  grid-template-columns: auto 1fr;
  grid-template-rows: auto auto;
  border-left-width: 2px;
  border-left-style: solid;
  gap: 4px 8px;
  padding: 8px;

  & .title {
    grid-column: 2;
    grid-row: 1;
    font-weight: 700;
  }

  & .description {
    grid-column: 2;
    grid-row: 2;
    font-weight: 400;
  }

  & .icon {
    grid-column: 1;
    grid-row: 1;
    display: inherit;
    width: 14px;
    height: 14px;
    stroke-width: calc(32px / 14);
  }

  &.info {
    border-color: var(--knime-cornflower);
    background-color: var(--knime-message-info-light);

    & .icon {
      stroke: var(--knime-cornflower);
    }
  }

  &.warning {
    border-color: var(--knime-carrot);
    background-color: var(--knime-message-warning-light);

    & .icon {
      stroke: var(--knime-carrot);
    }
  }

  &.error {
    border-color: var(--knime-message-error-dark);
    background-color: var(--knime-message-error-light);

    & .icon {
      stroke: var(--knime-message-error-dark);
    }
  }

  &.success {
    border-color: var(--knime-meadow);
    background-color: var(--knime-message-success-light);

    & .icon {
      stroke: var(--knime-meadow);
    }
  }

  &.promotion {
    border-color: var(--knime-yellow);
    background-color: var(--knime-message-promotion-light);

    & .icon {
      stroke: var(--knime-yellow);
    }
  }
}
</style>
