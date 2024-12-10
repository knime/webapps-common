<template>
  <component
    :is="shape"
    v-bind="attrs"
    :fill="fillColor"
    :class="['clickable', { disabled }]"
    @click="onClick"
  />
</template>

<script setup lang="ts">
import { type PropType, useAttrs } from "vue";
import type { ControlElement } from "@jsonforms/core";
import { rendererProps } from "@jsonforms/vue";

import useVennDiagramBooleanControl from "./useVennDiagramBooleanControl";

const props = defineProps({
  ...rendererProps<ControlElement>(),
  shape: {
    type: String as PropType<"circle" | "path">,
    required: true,
  },
});

const attrs = useAttrs();
const { fillColor, onClick, disabled } = useVennDiagramBooleanControl(props);
</script>

<style scoped lang="postcss">
.clickable {
  cursor: pointer;

  &.disabled {
    cursor: auto;
  }
}
</style>
