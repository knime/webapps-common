<script setup lang="ts">
import { computed, ref, watch } from "vue";
import { cloneDeep, isEqual } from "lodash-es";

import { FileSelector } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<VueControlPropsForLabelContent<Array<File>>>();

const files = ref(cloneDeep(props.control.data));

const acceptedFileTypes = computed(
  () => props.control.uischema.options?.accept ?? "*",
);

const multiple = computed(
  () => props.control.uischema.options?.multiple ?? false,
);

watch(files, (newValue, oldValue) => {
  if (!isEqual(newValue, oldValue)) {
    props.handleChange(props.control.path, Array.from(newValue));
  }
});
</script>

<template>
  <FileSelector
    v-model="files"
    :accepted-file-types="acceptedFileTypes"
    :multiple="multiple"
    :label="control.label"
  />
</template>
