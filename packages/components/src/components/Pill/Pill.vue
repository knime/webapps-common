<script setup lang="ts">
import * as $colors from "@knime/styles/colors/knimeColors";

export type PillVariant =
  | "default"
  | "light"
  | "info"
  | "warning"
  | "error"
  | "success"
  | "promotion";

type Color = {
  background: string;
  foreground?: string;
  text: string;
};

type Props = {
  variant?: PillVariant;
};

const props = withDefaults(defineProps<Props>(), {
  variant: "default",
});

const colorMapper: Record<PillVariant, Color> = {
  default: {
    background: $colors.Porcelain,
    foreground: $colors.Black,
    text: $colors.Black,
  },
  light: {
    background: $colors.White,
    foreground: $colors.Black,
    text: $colors.Black,
  },
  info: {
    background: $colors.CornflowerUltraLight,
    foreground: $colors.CornflowerDark,
    text: $colors.CornflowerDark,
  },
  warning: {
    background: $colors.CarrotUltraLight,
    foreground: $colors.CarrotDark,
    text: $colors.Black,
  },
  error: {
    background: $colors.ErrorRedUltraLight,
    foreground: $colors.ErrorRed,
    text: $colors.ErrorRed,
  },
  success: {
    background: $colors.MeadowUltraLight,
    foreground: $colors.MeadowDark,
    text: $colors.MeadowDark,
  },
  promotion: {
    background: $colors.PetrolDark,
    foreground: $colors.White,
    text: $colors.White,
  },
};
</script>

<template>
  <div :class="['pill', props.variant.toLowerCase()]">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.pill {
  --pill-height: 20px;

  border-radius: 9999px;
  height: var(--pill-height);
  padding: 0 var(--space-8);
  display: inline-flex;
  align-items: center;
  background: v-bind("colorMapper[props.variant].background");
  color: v-bind("colorMapper[props.variant].text");
  width: max-content;
  font-size: 13px;
  font-weight: 500;

  & :slotted(svg) {
    margin-right: var(--space-4);

    @mixin svg-icon-size 12;
  }

  &.pill:not(.default, .light) :slotted(svg) {
    stroke: v-bind("colorMapper[props.variant].foreground");
  }
}
</style>
