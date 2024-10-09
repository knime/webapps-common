<script setup lang="ts">
// @ts-ignore
import * as $colors from "@knime/styles/colors/knimeColors";

export type Variant =
  | "Info"
  | "Warning"
  | "Error"
  | "Success"
  | "Promotion"
  | "Default"
  | "Muted";

type Color = {
  background: string;
  foreground?: string;
  text: string;
};

type Props = {
  variant?: Variant;
};

const props = withDefaults(defineProps<Props>(), {
  variant: "Default",
});

const colorMapper: Record<Variant, Color> = {
  Info: {
    background: $colors.CornflowerUltraLight,
    foreground: $colors.CornflowerDark,
    text: $colors.CornflowerDark,
  },
  Warning: {
    background: $colors.CarrotUltraLight,
    foreground: $colors.CarrotDark,
    text: $colors.Black,
  },
  Error: {
    background: $colors.ErrorRedUltraLight,
    foreground: $colors.ErrorRed,
    text: $colors.ErrorRed,
  },
  Success: {
    background: $colors.MeadowUltraLight,
    foreground: $colors.MeadowDark,
    text: $colors.MeadowDark,
  },
  Promotion: {
    background: $colors.PetrolDark,
    foreground: $colors.White,
    text: $colors.White,
  },
  Default: {
    background: $colors.Porcelain,
    foreground: $colors.Black,
    text: $colors.Black,
  },
  Muted: {
    background: $colors.White,
    foreground: $colors.Black,
    text: $colors.Black,
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

  &.pill:not(.default, .muted) :slotted(svg) {
    stroke: v-bind("colorMapper[props.variant].foreground");
  }
}
</style>
