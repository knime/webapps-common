<script setup lang="ts">
import { DispatchRenderer } from "@jsonforms/vue";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";

import useProvidedState from "./composables/useProvidedState";

const props = defineProps<VueControlPropsForLabelContent<number>>();

const dataType = "";

const providedState = useProvidedState(
  props.control.uischema.options?.provider,
  dataType,
);
</script>

<template>
  {{ props.control.path }}
  <DispatchRenderer
    v-if="providedState.length !== 0"
    :uischema="JSON.parse(providedState).uischema"
    :schema="JSON.parse(providedState).schema"
    :path="`${props.control.path}`"
  />
</template>
