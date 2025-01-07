<script setup lang="ts">
import { type ControlProps } from "@jsonforms/core";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsControl,
} from "@jsonforms/vue";

import DynamicValueControl, {
  type DynamicValueType,
} from "./DynamicValueControl.vue";

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
  <DynamicValueControl
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
  </DynamicValueControl>
</template>
