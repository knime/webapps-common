<script setup lang="ts">
import { computed } from "vue";

import { KdsDropdown } from "@knime/kds-components";

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
  <KdsDropdown
    :id="labelForId"
    v-model="modelValue"
    :possible-values="possibleValues"
    :ariaLabel="control.label"
    :disabled="disabled"
    :error="!isValid"
  />
</template>
