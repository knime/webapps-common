<script setup lang="ts">
import { computed } from "vue";
import { rendererProps } from "@jsonforms/vue";

import { DateTimeInput } from "@knime/components/date-time-input";

import useDialogControl from "../composables/components/useDialogControl";
import { localTimeUtils } from "../utils/localTimeUtils";

import LabeledControl from "./label/LabeledControl.vue";

const props = defineProps(rendererProps());
const { control, disabled, onChange } = useDialogControl<string>({ props });

const model = computed(() => localTimeUtils.fromString(control.value.data));
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <DateTimeInput
      :id="labelForId"
      :model-value="model"
      :required="true"
      compact
      :disabled="disabled"
      :show-date="false"
      :show-time="true"
      :show-milliseconds="true"
      @update:model-value="
        (newValue) => onChange(localTimeUtils.toString(newValue))
      "
    />
  </LabeledControl>
</template>
