<script setup lang="ts">
import { toRef } from "vue";

import { MultiselectListBox } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";

import { usePossibleValues } from "./composables/usePossibleValues";

const props = defineProps<VueControlPropsForLabelContent<string[]>>();

const { possibleValues } = usePossibleValues(toRef(props, "control"));
</script>

<template>
  <!--  eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->
  <MultiselectListBox
    :id="labelForId"
    :possible-values="possibleValues || []"
    :disabled
    :model-value="control.data"
    :is-valid
    :ariaLabel="control.label"
    :size="control.uischema.options?.size"
    @update:model-value="changeValue"
  />
</template>
