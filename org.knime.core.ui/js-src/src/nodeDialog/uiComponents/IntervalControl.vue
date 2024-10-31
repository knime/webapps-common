<script setup lang="ts">
import { computed } from "vue";
import { rendererProps } from "@jsonforms/vue";

import { IntervalInput } from "@knime/components";

import useDialogControl from "../composables/components/useDialogControl";
import useProvidedState from "../composables/components/useProvidedState";

import LabeledControl from "./label/LabeledControl.vue";

const props = defineProps(rendererProps());

const { control, disabled, onChange } = useDialogControl<string>({
  props,
});

const options = computed(() => {
  return control.value.uischema.options;
});
const format = useProvidedState<"DATE" | "TIME" | "DATE_OR_TIME">(
  computed(() => options.value?.intervalTypeProvider),
  options.value?.intervalType ?? "DATE_OR_TIME",
);
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <IntervalInput
      :id="labelForId"
      compact
      :disabled="disabled"
      :model-value="control.data"
      :format="format"
      @update:model-value="onChange"
    />
  </LabeledControl>
</template>
