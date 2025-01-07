<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { rendererProps } from "@jsonforms/vue";

import { Checkboxes } from "@knime/components";

import useDialogControl from "../composables/components/useDialogControl";
import { type IdAndText } from "../types/ChoicesUiSchema";
import { optionsMapper } from "../utils";

import LabeledControl from "./label/LabeledControl.vue";

const props = defineProps(rendererProps());
const { control, disabled, onChange } = useDialogControl({ props });

const alignment = computed(
  () => control.value.uischema.options?.checkboxLayout,
);

const options = ref(null as null | IdAndText[]);
onMounted(() => {
  options.value = control.value.schema.anyOf?.map(optionsMapper)!;
});
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    :margin-bottom="-10"
    @controlling-flow-variable-set="onChange"
  >
    <Checkboxes
      v-if="options"
      :id="labelForId"
      :possible-values="options"
      :alignment="alignment"
      :disabled="disabled"
      :model-value="control.data"
      @update:model-value="onChange"
    />
  </LabeledControl>
</template>
