<script setup lang="ts">
import { computed } from "vue";
type Props = {
  /**
   * The percentage of progress to display.
   * If the value is less than 1, it will be displayed as 1%. If the value
   * is greater than 100, it will be capped at 100%. Defaults to 0.
   */
  percentage?: number;
  /**
   * Whether to display an indeterminate loading
   * state instead of a specific percentage. Defaults to false.
   */
  indeterminate?: boolean;
  /**
   * Whether to show the progress bar in a compact
   * mode. Defaults to false.
   */
  compact?: boolean;
  /**
   * Custom tooltip could be provided
   */
  toolTip?: string;
};
const props = withDefaults(defineProps<Props>(), {
  percentage: 0,
  indeterminate: false,
  compact: false,
  toolTip: "",
});
const progressValue = computed(() => {
  const percentage = props.percentage ?? 0;
  if (isNaN(percentage) || percentage < 1) {
    return "1";
  } else if (percentage > 100) {
    return "100";
  } else {
    return `${percentage}`;
  }
});
const toolTip = computed(() => {
  return props.toolTip || `Progress:${props.percentage ?? 0}%`;
});
</script>

<template>
  <div :class="['progress-bar-wrapper', { compact: props.compact }]">
    <progress
      :title="toolTip"
      v-bind="!props.indeterminate && { value: progressValue, max: 100 }"
    />
  </div>
</template>

<style scoped lang="postcss">
.progress-bar-wrapper {
  --loading-bar-background-color: var(--knime-silver-sand);
  --loading-bar-foreground-color: var(--theme-slider-background-color);
  --progress-bar-height: var(--space-16);
  --progress-bar-height-compact: var(--space-4);
  --progress-bar-radius: calc(var(--progress-bar-height) - 0.5px);

  width: 100%;
  height: var(--progress-bar-height);
  border-radius: var(--progress-bar-radius);

  & progress[value] {
    display: block;
    width: 100%;
    height: var(--progress-bar-height);
    border-radius: var(--progress-bar-radius);
    overflow: hidden;
    appearance: none;
  }

  & progress[value]::-webkit-progress-bar {
    border-radius: var(--progress-bar-radius);
    background: var(--loading-bar-background-color);
  }

  & progress[value]::-webkit-progress-value {
    border-radius: var(--progress-bar-radius);
    background: var(--loading-bar-foreground-color);
    transition: width 0.3s ease-in-out;
  }

  & progress:not([value]) {
    display: block;
    border-radius: var(--progress-bar-radius);
    width: 100%;
    height: var(--progress-bar-height);
    position: relative;
    overflow: hidden;
  }

  & progress:not([value])::-webkit-progress-bar {
    border-radius: var(--progress-bar-radius);
    background: var(--loading-bar-background-color);
  }

  & progress:not([value])::after {
    content: "";
    border-radius: var(--progress-bar-radius);
    position: absolute;
    inset: 0;
    background-color: var(--loading-bar-foreground-color);
    z-index: 1;
    animation: loading 1.5s linear infinite;
  }

  &.compact {
    --progress-bar-height: var(--space-4);

    & progress {
      height: var(--progress-bar-height);
      border-radius: var(--progress-bar-radius);
    }

    & progress:not([value])::after {
      border-radius: var(--progress-bar-radius);
    }
  }
}

@keyframes loading {
  0% {
    left: -50%;
    right: 100%;
  }

  100% {
    left: 100%;
    right: -50%;
  }
}
</style>
