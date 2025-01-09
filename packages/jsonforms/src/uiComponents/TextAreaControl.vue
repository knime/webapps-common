<script setup lang="ts">
import { TextArea } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/addLabel";

defineProps<VueControlPropsForLabelContent<string>>();
</script>

<template>
  <TextArea
    :id="labelForId"
    class="text-area-input"
    :model-value="control.data"
    :disabled="disabled"
    :rows="control.uischema.options?.rows"
    @update:model-value="changeValue"
  />
</template>

<style lang="postcss" scoped>
.text-area-input {
  max-width: 100%;

  & :deep(textarea) {
    resize: vertical;
    width: 100%;
    min-height: 40px;
    padding: 10px;
  }
}
</style>
