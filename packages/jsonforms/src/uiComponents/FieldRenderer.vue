<script setup lang="ts" generic="T">
import { computed } from "vue";
import type { UISchemaElement } from "@jsonforms/core";
import { DispatchRenderer } from "@jsonforms/vue";

import type { VueControlProps } from "../higherOrderComponents";

const composePaths = (path1: string, path2: string) => {
  if (path1 === "") {
    return path2;
  }
  return `${path1}.${path2}`;
};

const props = defineProps<{
  control: VueControlProps<T>["control"];
  fieldName: keyof T & string;
  uischema: UISchemaElement & { scope?: `#${string}` };
}>();

const path = computed(() => composePaths(props.control.path, props.fieldName));
const schema = computed(
  () => props.control.schema.properties![props.fieldName],
);
</script>

<template>
  <DispatchRenderer
    :key="path"
    :schema
    :uischema
    :path
    :enabled="control.enabled"
    :renderers="control.renderers"
    :cells="control.cells"
  />
</template>
