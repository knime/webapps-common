<script setup lang="ts">
import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/addLabel";

import RadioControlBase from "./RadioControlBase.vue";

defineProps<VueControlPropsForLabelContent<string>>();
</script>

<template>
  <RadioControlBase v-bind="$props" type="radio" class="radio" />
</template>

<style scoped lang="postcss">
.radio {
  margin-bottom: -10px;
}
</style>
