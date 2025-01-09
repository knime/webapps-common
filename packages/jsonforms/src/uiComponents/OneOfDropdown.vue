<script setup lang="ts">
import type { VueControlProps } from "../higherOrderComponents/control/types";
import { optionsMapper } from "../utils";

import DropdownControl from "./DropdownControl.vue";

const props = defineProps<VueControlProps<string | null>>();
const options = props.control.schema?.oneOf?.map(optionsMapper) ?? [];
const asyncInitialOptions = Promise.resolve(options);
</script>

<template>
  <DropdownControl
    v-bind="{ ...$attrs, ...$props }"
    :async-initial-options="asyncInitialOptions"
  >
    <template #icon>
      <slot name="icon" />
    </template>
    <template #buttons="{ hover, controlHTMLElement }">
      <slot
        name="buttons"
        :hover="hover"
        :control-h-t-m-l-element="controlHTMLElement"
      />
    </template>
  </DropdownControl>
</template>
