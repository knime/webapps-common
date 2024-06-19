<script setup lang="ts">
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsControl,
} from "@jsonforms/vue";

import DynamicValueInput, {
  type DynamicValueType,
} from "./DynamicValueInput.vue";
import { ControlProps } from "@jsonforms/core";

enum InputKind {
  SINGLE = "SINGLE",
  DOUBLE = "DOUBLE",
  COLLECTION = "COLLECTION",
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars, unused-imports/no-unused-vars
interface DynamicValueInputType {
  values: DynamicValueType[];
  inputKind: InputKind;
}

const props = defineProps(rendererProps());
const { control, handleChange } = useJsonFormsControl(props as ControlProps);
</script>

<template>
  <DynamicValueInput
    v-for="(value, index) in control.data.values"
    #default="{ uischema, schema }"
    :key="index"
    :value="value"
    @update-value="
      handleChange(`${control.path}.values.${index}.value`, $event)
    "
  >
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
