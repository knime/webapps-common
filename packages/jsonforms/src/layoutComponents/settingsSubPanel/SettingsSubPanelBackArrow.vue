<script setup lang="ts">
import { computed } from "vue";

import { FunctionButton } from "@knime/components";
import * as $colors from "@knime/styles/colors/knimeColors";
import ArrowLeft from "@knime/styles/img/icons/arrow-left.svg";

const emit = defineEmits(["click"]);

const props = withDefaults(
  defineProps<{
    backgroundColorOverride?: string;
  }>(),
  {
    backgroundColorOverride: undefined,
  },
);

const styleOverrides = computed(() => ({
  backgroundColor: props.backgroundColorOverride ?? $colors.GrayUltraLight,
}));
</script>

<template>
  <div class="flex-horizontal" :style="styleOverrides">
    <FunctionButton
      primary
      class="arrow-left-button"
      @click="() => emit('click')"
      ><ArrowLeft
    /></FunctionButton>
    <span class="spacer" />
    <span class="bold">Back to node configuration</span>
  </div>
</template>

<style scoped lang="postcss">
.flex-horizontal {
  display: flex;
  align-items: center;
  padding: 10px;
  background-color: var(--knime-gray-ultra-light);

  & .spacer {
    height: 25px;
    margin: auto 0.6em auto 0.2em;
    border: 0.4pt solid var(--knime-silver-sand);
  }

  & .bold {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
