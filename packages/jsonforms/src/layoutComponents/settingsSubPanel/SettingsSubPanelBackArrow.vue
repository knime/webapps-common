<script setup lang="ts">
import { computed } from "vue";

import { FunctionButton } from "@knime/components";
import * as $colors from "@knime/styles/colors/knimeColors";
import ArrowLeft from "@knime/styles/img/icons/arrow-left.svg";

interface Props {
  backgroundColorOverride?: string;
  backButtonLabel?: string;
}

const emit = defineEmits(["click"]);

const {
  backgroundColorOverride = $colors.GrayUltraLight,
  backButtonLabel = "Back to node configuration",
} = defineProps<Props>();

const styleOverrides = computed(() => ({
  backgroundColor: backgroundColorOverride,
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
    <span class="bold">{{ backButtonLabel }}</span>
  </div>
</template>

<style scoped>
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
