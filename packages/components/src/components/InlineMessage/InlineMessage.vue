<script setup lang="ts">
import CircleCheckIcon from "@knime/styles/img/icons/circle-check.svg";
import CircleCloseIcon from "@knime/styles/img/icons/circle-close.svg";
import CircleInfoIcon from "@knime/styles/img/icons/circle-info.svg";
import RocketIcon from "@knime/styles/img/icons/rocket.svg";
import SignWarningIcon from "@knime/styles/img/icons/sign-warning.svg";

export type InlineMessageVariant =
  | "info"
  | "warning"
  | "error"
  | "success"
  | "promotion";

const TYPE_ICON_MAP = {
  info: CircleInfoIcon,
  warning: SignWarningIcon,
  error: CircleCloseIcon,
  success: CircleCheckIcon,
  promotion: RocketIcon,
};

defineProps<{
  variant: InlineMessageVariant;
  title: string;
  description: string;
}>();
</script>

<template>
  <div :class="['inline-message', variant]">
    <component :is="TYPE_ICON_MAP[variant]" class="icon" />
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
    background-color: var(--knime-cornflower-ultra-light);

    & .icon {
      stroke: var(--knime-cornflower);
    }
  }

  &.warning {
    border-color: var(--knime-carrot);
    background-color: var(--knime-carrot-ultra-light);

    & .icon {
      stroke: var(--knime-carrot);
    }
  }

  &.error {
    border-color: var(--knime-error-red);
    background-color: var(--knime-error-red-ultra-light);

    & .icon {
      stroke: var(--knime-error-red);
    }
  }

  &.success {
    border-color: var(--knime-meadow-dark);
    background-color: var(--knime-meadow-ultra-light);

    & .icon {
      stroke: var(--knime-meadow-dark);
    }
  }

  &.promotion {
    border-color: var(--knime-yellow);
    background-color: var(--knime-yellow-ultra-light);

    & .icon {
      stroke: var(--knime-yellow);
    }
  }
}
</style>
