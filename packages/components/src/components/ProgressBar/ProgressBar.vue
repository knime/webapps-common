<script lang="ts" setup>
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
const progressStyle = computed(() => {
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
  <div
    :class="['progress-bar-wrapper', 'show-bar', { compact: props.compact }]"
  >
    <progress
      v-if="!props.indeterminate"
      :title="toolTip"
      :value="progressStyle"
      max="100"
      class="progress"
    />

    <progress
      v-else
      max="100"
      :title="toolTip"
      class="progress indeterminate"
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

  margin-top: 10px;
  display: none;
  width: 100%;
  height: var(--progress-bar-height);
  border-radius: var(--progress-bar-radius);

  & progress[value] {
    --color: var(--knime-yellow);
    --background: var(--knime-silver-sand);

    display: block;
    width: 100%;
    height: var(--progress-bar-height);
    border-radius: var(--progress-bar-radius);
    overflow: hidden;
    appearance: none;
  }

  & progress[value]::-webkit-progress-bar {
    border-radius: var(--progress-bar-radius);
    background: var(--background);
  }

  & progress[value]::-webkit-progress-value {
    border-radius: var(--progress-bar-radius);
    background: var(--color);
    transition: width 0.3s ease-in-out;
  }

  & progress:not([value]) {
    --color: var(--knime-yellow);
    --background: var(--knime-silver-sand);

    display: block;
    border-radius: var(--progress-bar-radius);
    width: 100%;
    height: var(--progress-bar-height);
    overflow: hidden;
  }

  & progress:not([value])::-webkit-progress-bar {
    border-radius: 10px;
    background: var(--background);
  }

  & progress:not([value])::-webkit-progress-value {
    border-radius: 10px;
    background: var(--color);
    transition: width 0.3s ease-in-out;
  }

  & .progress-bar {
    width: 0;
    height: var(--progress-bar-height);
    background-color: var(--theme-slider-background-color);
    border-radius: var(--progress-bar-radius);
    transition: width 0.2s;
  }

  & .indeterminate {
    height: 100%;
    width: 100%;
    position: relative;
    overflow: hidden;

    &::after {
      content: "";
      border-radius: var(--progress-bar-radius);
      position: absolute;
      inset: 0;
      background-color: var(--loading-bar-foreground-color);
      z-index: 1;
      animation: loading 1.5s linear infinite;
    }
  }

  &.show-bar {
    display: block;
  }

  &.compact {
    --progress-bar-height: var(--space-4);

    & .progress-bar {
      height: var(--progress-bar-height-compact);
      border-radius: var(--theme-slider-bar-radius);
    }

    & .indeterminate {
      &::after {
        border-radius: var(--theme-slider-bar-radius);
      }
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
