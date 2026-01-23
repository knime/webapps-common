<script setup lang="ts" generic="T">
import { computed } from "vue";

import type { VueControlProps } from "../higherOrderComponents";

import FieldRenderer from "./FieldRenderer.vue";

const props = defineProps<{
  control: VueControlProps<T>["control"];
  fieldName: keyof T & string;
  format?: string;
  options?: object;
}>();

const uischema = computed(() => {
  return {
    type: "Control",
    scope: "#" as const,
    options: {
      ...props.options,
      format: props.format,
    },
  };
});
</script>

<template>
  <FieldRenderer
    :field-name="fieldName as string & keyof T"
    :uischema
    :control
  />
</template>
