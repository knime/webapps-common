<script setup lang="ts">
import { toRef } from "vue";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";
import { usePossibleValues } from "../composables/usePossibleValues";

import TwinlistControlBase from "./TwinlistControlBase.vue";

const props = defineProps<VueControlPropsForLabelContent<string[]>>();

const control = toRef(props, "control");

const { possibleValues } = usePossibleValues(control);
</script>

<template>
  <TwinlistControlBase
    v-bind="props"
    :possible-values
    :twinlist-size="props.control.uischema.options?.twinlistSize"
  />
</template>
