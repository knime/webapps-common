<script setup lang="ts">
// TODO: HUB port last synced on 2025-02-04

import { IdleReadyButton } from "@knime/components";

type LoadMoreButtonProps = {
  loading?: boolean;
  showMore?: boolean;
  readyText?: string;
  idleText?: string;
};
withDefaults(defineProps<LoadMoreButtonProps>(), {
  showMore: true,
  readyText: "More results",
  idleText: "Loading…",
});
const emit = defineEmits(["click"]);

const onClick = () => {
  emit("click");
};
</script>

<template>
  <IdleReadyButton
    with-down-icon
    :idle="loading"
    :ready="showMore"
    :idle-text="idleText"
    :ready-text="readyText"
    @click="onClick"
  />
</template>

<style lang="postcss" scoped>
.load-more {
  color: var(--knime-dove-gray);
  padding-top: 0;

  & :deep(button),
  & :deep(span) {
    min-width: 200px !important;
    padding: 1em 1em 3em !important;
    position: relative;
  }

  & :deep(button) {
    border: none !important;
    color: inherit !important;
    font-weight: 400 !important;
  }

  & :deep(button[disabled]) {
    opacity: unset;
  }

  & :deep(button.compact > svg) {
    width: 20px !important;
    height: 20px !important;
    stroke-width: calc(32px / 20) !important;
    stroke: var(--knime-dove-gray) !important;
    position: absolute;
    left: calc((100% - 20px) / 2);
    top: 33px;
  }

  & :deep(button:hover),
  & :deep(button:focus),
  & :deep(button:active) {
    background: transparent !important;
    color: var(--knime-masala) !important;

    & > svg {
      stroke: var(--knime-masala) !important;
    }
  }
}
</style>
