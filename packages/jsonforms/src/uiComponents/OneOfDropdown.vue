<script setup lang="ts">
import { computed } from "vue";

import { Dropdown } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";
import { optionsMapper } from "../utils";

const props = defineProps<VueControlPropsForLabelContent<string | null>>();

const possibleValues = props.control.schema?.oneOf?.map(optionsMapper) ?? [];

const modelValue = computed<string>({
  get: () => props.control.data ?? "",
  set: props.changeValue,
});
</script>

<template>
  <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
  <Dropdown
    :id="labelForId"
    v-model="modelValue"
    :possible-values
    :ariaLabel="control.label"
    :disabled="disabled"
    compact
  />
</template>
