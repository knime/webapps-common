<script setup lang="ts">
import { computed } from "vue";

import { Button, FunctionButton, Tooltip } from "@knime/components";
import ArrowLeftIcon from "@knime/styles/img/icons/arrow-left.svg";
import CloseIcon from "@knime/styles/img/icons/close.svg";
import { truncateString } from "@knime/utils";

const TITLE_MAX_LENGTH = 70;

type Props = {
  title: string;
  description?: string | null;
  isSubDrawer?: boolean;
};
const { title, description = "", isSubDrawer = false } = defineProps<Props>();

defineEmits<{
  close: [];
}>();

const headline = computed(() => {
  return truncateString(title, TITLE_MAX_LENGTH);
});
const hasTooltip = computed(() => {
  return title.length > TITLE_MAX_LENGTH;
});
const tooltipOrDiv = computed(() => {
  return hasTooltip.value ? Tooltip : "div";
});
</script>

<template>
  <div class="header">
    <div>
      <div v-if="isSubDrawer" class="subdrawer">
        <Button @click.prevent="$emit('close')">
          <ArrowLeftIcon class="left-arrow-icon" />
        </Button>
        <Component :is="tooltipOrDiv" :text="title">
          <span class="title">{{ headline }}</span>
        </Component>
      </div>
      <div v-else class="headline">
        <slot />
        <Component :is="tooltipOrDiv" :text="title">
          <h4>{{ headline }}</h4>
        </Component>
      </div>
    </div>
    <p v-if="description">
      {{ description }}
    </p>
    <FunctionButton class="close" @click.prevent="$emit('close')">
      <CloseIcon />
    </FunctionButton>
  </div>
</template>

<style lang="postcss" scoped>
.header {
  z-index: 1;
  position: relative;
  padding: 32px 30px 0;

  & .subdrawer {
    margin-bottom: 30px;
    display: flex;
    align-items: center;
    gap: 9px;

    & .title {
      font-weight: 700;
      font-size: 20px;
      line-height: 20px;
    }

    & .button {
      padding: 0;
      color: var(--knime-black);

      & > .left-arrow-icon {
        top: 0;
        width: 36px;
        height: 30px;
        padding-right: 14px;
        stroke-width: calc(32px / 18);
        border-right: 1px solid var(--knime-silver-sand);
        margin-right: 5px;
      }
    }
  }

  & .headline {
    margin-bottom: 30px;
    display: flex;
    align-items: flex-start;
    gap: 9px;

    & :deep(svg) {
      flex: 0 0 24px;
      z-index: 2;
      height: 24px;
      stroke-width: calc(32px / 18);
      stroke: var(--knime-masala);
      position: relative;
    }

    & h4 {
      flex: 1 1 auto;
      z-index: 1;
      display: inline;
      margin: 0;
      font-size: 22px;
      line-height: 26px;
    }
  }

  & p {
    font-size: 16px;
    line-height: 24px;
  }

  & .close {
    position: absolute;
    top: 6px;
    right: 6px;
    z-index: 3;
  }

  & .tooltip {
    & .label-wrapper {
      margin-bottom: 30px;
    }

    & :deep(.text) {
      width: 100%;
      white-space: normal;
      transform: none;
      top: 60px;
      left: 0;

      &::after {
        top: -12px;
      }
    }
  }
}
</style>
