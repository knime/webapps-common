<script setup lang="ts">
import { FunctionButton } from "@knime/components";
import ArrowLeft from "@knime/styles/img/icons/arrow-left.svg";

const emit = defineEmits(["click"]);
</script>

<template>
  <div class="flex-horizontal">
    <FunctionButton class="arrow-left-button" @click="() => emit('click')"
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
  margin: 10px 0;

  & .spacer {
    border: 0.4pt solid var(--knime-silver-sand);
    height: 25px;
    margin: auto 0.6em auto 0.2em;
  }

  & .bold {
    font-size: 14px;
    font-weight: 500;
  }
}
</style>
