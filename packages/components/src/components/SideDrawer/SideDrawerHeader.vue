<script setup lang="ts">
import { computed } from "vue";

import ArrowLeftIcon from "@knime/styles/img/icons/arrow-left.svg";
import CloseIcon from "@knime/styles/img/icons/close.svg";
import { truncateString } from "@knime/utils";

import Button from "../Buttons/Button.vue";
import FunctionButton from "../Buttons/FunctionButton.vue";
import Tooltip from "../Tooltip/Tooltip.vue";

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
  position: relative;
  z-index: 1;
  padding: 32px 30px 0;
  background-color: var(--side-drawer-header-background);
  --side-drawer-header-background: var(--knime-white);

  & .subdrawer {
    display: flex;
    gap: 9px;
    align-items: center;
    margin-bottom: 30px;

    & .title {
      font-size: 20px;
      font-weight: 700;
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
        margin-right: 5px;
        border-right: 1px solid var(--knime-silver-sand);
        stroke-width: calc(32px / 18);
      }
    }
  }

  & .headline {
    display: flex;
    gap: 9px;
    align-items: flex-start;
    margin-bottom: 30px;

    & :deep(svg) {
      position: relative;
      z-index: 2;
      flex: 0 0 24px;
      height: 24px;
      stroke: var(--knime-masala);
      stroke-width: calc(32px / 18);
    }

    & h4 {
      z-index: 1;
      display: inline;
      flex: 1 1 auto;
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
      top: 60px;
      left: 0;
      width: 100%;
      white-space: normal;
      transform: none;

      &::after {
        top: -12px;
      }
    }
  }
}
</style>
