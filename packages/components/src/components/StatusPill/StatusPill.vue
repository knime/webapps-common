<script setup lang="ts">
import { computed } from "vue";
// @ts-ignore
import * as $colors from "@knime/styles/colors/knimeColors";
/**
 * Colors should be fixed based on these states
 */
type State = "Info" | "Warning" | "Error" | "Success" | "Promotion";
type Props = {
  state: State;
};
const props = withDefaults(defineProps<Props>(), {
  state: "Info",
});
const bgColor = computed(() => {
  const mapper: Record<State, string> = {
    Info: $colors.CornflowerSemi,
    Warning: $colors.LightWarningStatusPill,
    Error: $colors.MessageErrorLight,
    Success: $colors.MessageSuccessLight,
    Promotion: $colors.PetrolDark,
  };
  return mapper[props.state];
});
const textColor = computed(() => {
  const mapper: Record<State, string> = {
    Info: $colors.CornflowerDark,
    Warning: $colors.Black,
    Error: $colors.CoralDark,
    Success: $colors.MeadowDark,
    Promotion: $colors.White,
  };
  return mapper[props.state];
});
</script>

<template>
  <div class="status-pill"><slot /></div>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/mixins.css");

.status-pill {
  --pill-height: 20px;

  border-radius: 9999px;
  height: var(--pill-height);
  padding: 0 10px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  background: v-bind(bgColor);
  color: v-bind(textColor);
  width: max-content;
  font-size: 13px;
  font-weight: 500;

  & :slotted(svg) {
    margin-right: 4px;

    @mixin svg-icon-size 12;

    stroke: v-bind(textColor);

    & circle {
      stroke: v-bind(textColor);
    }
  }
}
</style>
