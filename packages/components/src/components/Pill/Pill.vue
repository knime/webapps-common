<script setup lang="ts">
import { computed } from "vue";
// @ts-ignore
import * as $colors from "@knime/styles/colors/knimeColors";

type Color = "white" | "gray";

type Props = {
  color?: Color;
};

const props = withDefaults(defineProps<Props>(), {
  color: "gray",
});

const color = computed(() => {
  const mapper: Record<Color, string> = {
    white: $colors.White,
    gray: $colors.Porcelain,
  };

  return mapper[props.color];
});
</script>

<template>
  <div class="pill"><slot /></div>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.pill {
  --pill-height: 20px;

  border-radius: 9999px;
  height: var(--pill-height);
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  background: v-bind(color);
  width: max-content;
  font-size: 13px;
  font-weight: 500;

  & :slotted(svg) {
    margin-right: 4px;

    @mixin svg-icon-size 12;
  }
}
</style>
