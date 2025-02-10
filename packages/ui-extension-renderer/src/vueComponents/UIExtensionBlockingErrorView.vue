<script setup lang="ts">
import { Button } from "@knime/components";
import CircleCloseIcon from "@knime/styles/img/icons/circle-close.svg";

import type { ErrorAlert } from "./types";

defineProps<{
  alert: ErrorAlert | null;
}>();

defineEmits<{
  retry: [];
}>();
</script>

<template>
  <div v-if="alert" class="wrapper">
    <CircleCloseIcon />
    <span>{{ alert.message }}</span>
    <Button primary compact @click="$emit('retry')">Try again</Button>
  </div>
</template>

<style scoped lang="postcss">
.wrapper {
  container-type: inline-size;
  padding: var(--space-16);
  width: 100%;
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 20px;

  & span {
    text-align: center;
    white-space: pre-line;
  }

  & svg {
    height: 30%;
    max-height: 100px;
    stroke: var(--knime-dove-gray);
    stroke-width: 1px;
  }
}
</style>
