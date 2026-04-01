<script setup lang="ts">
import { KdsColorInput } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

defineProps<VueControlPropsForLabelContent<string | null>>();
</script>

<template>
  <KdsColorInput
    :id="labelForId"
    :ariaLabel="control.label"
    :model-value="control.data ?? ''"
    :disabled="disabled"
    :error="!isValid"
    @update:model-value="changeValue"
  />
</template>
