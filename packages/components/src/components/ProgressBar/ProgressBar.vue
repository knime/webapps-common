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
  return props.toolTip || `Progress:${progressValue.value}%`;
});
</script>

<template>
  <div :class="['progress-bar-wrapper', { compact: props.compact }]">
    <progress
      :title="toolTip"
      class="progress"
      v-bind="!props.indeterminate && { value: progressValue, max: 100 }"
    />
  </div>
</template>

<style scoped lang="postcss">
.progress-bar-wrapper {
  --loading-bar-background-color: var(--knime-silver-sand);
  --loading-bar-foreground-color: var(--theme-slider-background-color);
  --progress-bar-height: var(--space-16);
  --progress-bar-radius: calc(var(--progress-bar-height) - 0.5px);

  width: 100%;
  height: var(--progress-bar-height);
  border-radius: var(--progress-bar-radius);
  position: relative;

  & .progress {
    appearance: none;
    border: none;
    border-radius: var(--progress-bar-radius);
    display: block;
    height: var(--progress-bar-height);
    overflow: hidden;
    padding: 0;
    width: 100%;

    /* Firefox sets the background of the bar from here  */
    background-color: var(--loading-bar-background-color);
  }

  &.compact {
    --progress-bar-height: var(--space-4);
  }

  & .progress::-webkit-progress-bar {
    background-color: var(--loading-bar-background-color);
  }

  & .progress::-webkit-progress-value {
    border-radius: var(--progress-bar-radius);
    background-color: var(--loading-bar-foreground-color);
  }

  /* Firefox uses this to target the bar that represents the value of the progress element */
  & .progress::-moz-progress-bar {
    background-color: var(--loading-bar-foreground-color);
  }

  & .progress:indeterminate {
    animation-duration: 1.5s;
    animation-iteration-count: infinite;
    animation-name: move-indeterminate;
    animation-timing-function: linear;
    background-color: var(--loading-bar-background-color);
    background-image: linear-gradient(
      to right,
      var(--loading-bar-foreground-color) 30%,
      var(--loading-bar-background-color) 30%
    );
    background-position: 0 0;
    background-repeat: no-repeat;
    background-size: 150% 150%;
  }

  & .progress:indeterminate::-webkit-progress-bar,
  & .progress:indeterminate::-moz-progress-bar {
    background-color: transparent;
  }
}

@keyframes move-indeterminate {
  0% {
    background-position: 200% 0;
  }

  100% {
    background-position: -200% 0;
  }
}
</style>
