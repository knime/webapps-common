<script setup lang="ts">
import { computed, toRefs } from "vue";

import * as $colors from "@knime/styles/colors/knimeColors";

type Props = {
  /**
   * Width in px or %. Defaults to 100%
   */
  width?: `${number}px` | `${number}%`;
  /**
   * Height in px or %. Defaults to 100%
   */
  height?: `${number}px` | `${number}%`;
  /**
   * First color of the animation gradient. Defaults to GrayUltraLight
   */
  color1?: string;
  /**
   * Second color of the animation gradient. Defaults to Porcelain
   */
  color2?: string;
  /**
   * How to render the Skeleton. Defaults to `generic`
   * - generic: box with square borders
   * - buton: button/pill shaped skeleton
   * - icon-button: a circle skeleton
   * - rounded-sm: a box with a small border radius (4px)
   * - rounded-md: a box with a medium border radius (8px)
   */
  variant?: "generic" | "button" | "icon-button" | "rounded-sm" | "rounded-md";
  /**
   * Loading property. When true the skeleton is rendered, otherwise the content
   * of the default slot will be rendered instead
   */
  loading?: boolean;
  /**
   * Whether to repeat this skeleton N times. Defaults to 1
   */
  repeat?: number;
  /**
   * When `repeat` is set, this will be added as spacing in-between items. Defaults to 2px
   */
  repeatGap?: `${number}px`;
};

const props = withDefaults(defineProps<Props>(), {
  width: "100%",
  height: "100%",
  color1: $colors.GrayUltraLight,
  color2: $colors.Porcelain,
  variant: "generic",
  repeat: 1,
  loading: true,
  repeatGap: "2px",
});

const { color1, color2, width, height } = toRefs(props);

const borderRadius = computed(() => {
  const valueMap: Partial<Record<Required<Props>["variant"], string>> = {
    button: "9999px",
    "icon-button": "50%",
    "rounded-sm": "4px",
    "rounded-md": "8px",
  };

  return valueMap[props.variant] ?? "initial";
});

const gradient = computed(
  () =>
    `linear-gradient(to right, ${color1.value} 0%, ${color2.value} 25%, ${color1.value} 50%)`,
);

const styles = computed(() => {
  return {
    width: width.value,
    height: height.value,
    borderRadius: borderRadius.value,
    marginBottom: props.repeat > 1 ? props.repeatGap : "",
  };
});
</script>

<template>
  <template v-if="loading">
    <div
      v-for="index in repeat"
      :key="index"
      class="skeleton-item"
      v-bind="$attrs"
      :style="styles"
    />
  </template>
  <slot v-else v-bind="$attrs" />
</template>

<style lang="postcss" scoped>
@keyframes knight-rider {
  to {
    background-position-x: -200%;
  }
}

.skeleton-item {
  background: v-bind(gradient);
  background-size: 200% 100%;
  animation: 2s knight-rider linear infinite;
}
</style>
