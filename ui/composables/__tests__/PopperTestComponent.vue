<script setup lang="ts">
import { ref } from "vue";
import usePopper from "../usePopper";
import type { Options } from "@popperjs/core";

const props = defineProps<{
  options: Partial<Options>;
}>();

const toggleRef = ref(null);
const popoverRef = ref(null);

const { updatePopper } = usePopper(
  { referenceEl: toggleRef, popperTarget: popoverRef },
  props.options,
);
defineExpose({ updatePopper });
</script>

<template>
  <div id="toggle" ref="toggleRef" />
  <div id="popover" ref="popoverRef" />
</template>
