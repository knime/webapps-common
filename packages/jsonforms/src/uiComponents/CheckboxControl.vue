<script setup lang="ts">
import { ref } from "vue";

import { Checkbox } from "@knime/components";

import type { VueControlProps } from "../higherOrderComponents/control/types";

import ErrorMessage from "./ErrorMessage.vue";

defineProps<VueControlProps<boolean>>();
const hover = ref(false);
</script>

<template>
  <div
    class="checkbox-input"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <Checkbox
      class="checkbox"
      :disabled="disabled"
      :model-value="control.data"
      @update:model-value="changeValue"
    >
      {{ control.label }}
      <slot name="icon" />
    </Checkbox>
    <slot name="buttons" :hover="hover" />
    <ErrorMessage :error="control.errors" />
  </div>
</template>

<style lang="postcss" scoped>
.checkbox-input {
  margin-bottom: -10px;

  /**
   * This is necessary to fixate the dialog popovers
  */
  position: relative;
  display: flex;

  & .checkbox {
    min-width: 0;
    flex: 1;
  }
}

.reexecution-icon {
  display: inline-block;
  vertical-align: top;
  height: 10px;
  margin: 3px 0 1px 5px;
}
</style>
