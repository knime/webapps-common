<script setup lang="ts">
import { KdsTextarea } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

defineProps<VueControlPropsForLabelContent<string>>();
</script>

<template>
  <KdsTextarea
    :id="labelForId"
    :model-value="control.data"
    :disabled="disabled"
    :rows="control.uischema.options?.rows"
    :error="!isValid"
    @update:model-value="changeValue"
  />
</template>
