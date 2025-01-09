<script setup lang="ts">
import { DateTimeInput } from "@knime/components/date-time-input";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/addLabel";

defineProps<VueControlPropsForLabelContent<string>>();
</script>

<template>
  <DateTimeInput
    :id="labelForId"
    two-lines
    :model-value="new Date(control.data)"
    :required="true"
    :show-time="false"
    compact
    :disabled="disabled"
    @update:model-value="changeValue"
  />
</template>
