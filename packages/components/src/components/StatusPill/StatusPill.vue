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
type Colors = {
  background: string;
  forGround: string;
};
const props = withDefaults(defineProps<Props>(), {
  state: "Info",
});

const colors = computed(() => {
  const mapper: Record<State, Colors> = {
    Info: {
      background: $colors.MessageInfoLight,
      forGround: $colors.CornflowerDark,
    },
    Warning: {
      background: $colors.MessageWarningLight,
      forGround: $colors.Black,
    },
    Error: {
      background: $colors.MessageErrorLight,
      forGround: $colors.MessageErrorDark,
    },
    Success: {
      background: $colors.MessageSuccessLight,
      forGround: $colors.MeadowDark,
    },
    Promotion: {
      background: $colors.PetrolDark,
      forGround: $colors.White,
    },
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
  background: v-bind("colors.background");
  color: v-bind("colors.forGround");
  width: max-content;
  font-size: 13px;
  font-weight: 500;

  & :slotted(svg) {
    margin-right: 4px;

    @mixin svg-icon-size 12;

    stroke: v-bind("colors.forGround");
  }
}
</style>
