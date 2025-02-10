<script setup lang="ts">
import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";
import { optionsMapper } from "../../utils";

import TwinlistControlBase from "./TwinlistControlBase.vue";

const props = defineProps<VueControlPropsForLabelContent<string[]>>();
const possibleValues = props.control.schema.anyOf!.map(optionsMapper);
</script>

<template>
  <TwinlistControlBase v-bind="$props" :possible-values />
</template>
