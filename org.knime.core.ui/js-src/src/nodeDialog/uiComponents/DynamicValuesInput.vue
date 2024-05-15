<script setup lang="ts">
import useDialogControl from "../composables/components/useDialogControl";
import { DispatchRenderer, rendererProps } from "@jsonforms/vue";

import DynamicValueInput, {type DynamicValue } from "./DynamicValueInput.vue"



enum InputKind {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  COLLECTION = "COLLECTION"
}

interface DynamicValueInputType {
  values: DynamicValue[],
  inputKind: InputKind,
}

const props = defineProps(rendererProps());
const { onChange, control, disabled } = useDialogControl<DynamicValueInputType>({ props });
debugger;
</script>

<template>
  {{control.data}}
  <DynamicValueInput v-for="(value, index) in control.data.values" :value="value" #default="{uischema, schema}">
    <DispatchRenderer
              :schema="schema"
              :uischema="uischema"
              :path="`${control.path}.values.${index}`"
              :enabled="control.enabled"
              :renderers="control.renderers"
              :cells="control.cells"
            />
  </DynamicValueInput>

</template>
