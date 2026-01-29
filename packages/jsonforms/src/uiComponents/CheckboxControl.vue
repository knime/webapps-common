<script setup lang="ts">
import { ref } from "vue";

import { KdsCheckbox, type KdsCheckboxValue } from "@knime/kds-components";

import type { VueControlProps } from "../higherOrderComponents";

defineProps<VueControlProps<boolean>>();
const hover = ref(false);
</script>

<template>
  <div
    class="checkbox-input"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="checkbox-container">
      <KdsCheckbox
        class="checkbox"
        :disabled="disabled"
        :model-value="control.data"
        :label="control.label"
        @update:model-value="
          (value: KdsCheckboxValue) => changeValue(value as boolean)
        "
      />
      <slot name="icon" />
    </div>
    <slot name="buttons" :hover="hover" />
  </div>
</template>

<style lang="postcss" scoped>
.checkbox-input {
  /**
   * This is necessary to fixate the dialog popovers
  */
  position: relative;
  display: flex;
  margin-bottom: -10px;

  & .checkbox-container {
    display: flex;
    flex: 1;
    min-width: 0;
  }
}

/* via slot */
.reexecution-icon {
  display: inline-block;
  height: 10px;
  margin: 3px 0 1px 5px;
  vertical-align: top;
}
</style>
