<script setup lang="ts">
import { rendererProps } from "@jsonforms/vue";

import { DateTimeInput } from "@knime/components/date-time-input";

import useDialogControl from "../composables/components/useDialogControl";

import LabeledControl from "./label/LabeledControl.vue";

const props = defineProps(rendererProps());
const { control, disabled, onChange } = useDialogControl<string>({ props });
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <DateTimeInput
      :id="labelForId"
      two-lines
      :model-value="new Date(control.data)"
      :required="true"
      :show-time="false"
      compact
      :disabled="disabled"
      @update:model-value="onChange"
    />
  </LabeledControl>
</template>
