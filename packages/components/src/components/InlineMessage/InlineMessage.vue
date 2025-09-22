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
  description?: string;
}>();
</script>

<template>
  <div :class="['inline-message', variant]">
    <component :is="TYPE_ICON_MAP[variant]" class="icon" />
    <span class="title">{{ title }}</span>
    <span class="description">
      <slot>{{ description }}</slot>
    </span>
  </div>
</template>

<style lang="postcss" scoped>
.inline-message {
  display: grid;
  grid-template-rows: auto auto;
  grid-template-columns: auto 1fr;
  gap: 4px 8px;
  padding: 8px;
  font-size: 12px;
  line-height: 14px;
  border-left-style: solid;
  border-left-width: 2px;

  & .title {
    grid-row: 1;
    grid-column: 2;
    font-weight: 700;
  }

  & .description {
    grid-row: 2;
    grid-column: 2;
    font-weight: 400;
  }

  & .icon {
    display: inherit;
    grid-row: 1;
    grid-column: 1;
    width: 14px;
    height: 14px;
    stroke-width: calc(32px / 14);
  }

  &.info {
    background-color: var(--knime-cornflower-ultra-light);
    border-color: var(--knime-cornflower);

    & .icon {
      stroke: var(--knime-cornflower);
    }
  }

  &.warning {
    background-color: var(--knime-carrot-ultra-light);
    border-color: var(--knime-carrot);

    & .icon {
      stroke: var(--knime-carrot);
    }
  }

  &.error {
    background-color: var(--knime-error-red-ultra-light);
    border-color: var(--knime-error-red);

    & .icon {
      stroke: var(--knime-error-red);
    }
  }

  &.success {
    background-color: var(--knime-meadow-ultra-light);
    border-color: var(--knime-meadow-dark);

    & .icon {
      stroke: var(--knime-meadow-dark);
    }
  }

  &.promotion {
    background-color: var(--knime-yellow-ultra-light);
    border-color: var(--knime-yellow);

    & .icon {
      stroke: var(--knime-yellow);
    }
  }
}
</style>
