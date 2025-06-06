<script setup lang="ts">
import { type Ref, computed, onMounted, ref, toRef } from "vue";

import { RadioButtons, ValueSwitch } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents/control/withLabel";
import { type IdAndText } from "../types/ChoicesUiSchema";
import { optionsMapper } from "../utils";

import { usePossibleValues } from "./composables/usePossibleValues";

const props = defineProps<
  VueControlPropsForLabelContent<string> & {
    type: "radio" | "valueSwitch";
  }
>();

type PossiblyDisabledOption = IdAndText & { disabled?: true };

const alignment = computed(() => props.control.uischema.options?.radioLayout);
const disabledOptions = computed<string[]>(
  () => props.control.uischema.options?.disabledOptions ?? [],
);
const disableOption = (option: IdAndText): PossiblyDisabledOption =>
  disabledOptions.value.includes(option.id)
    ? { ...option, disabled: true }
    : option;

const uiComponent = computed(() =>
  props.type === "valueSwitch" ? ValueSwitch : RadioButtons,
);

const staticOptions: Ref<PossiblyDisabledOption[] | null | undefined> =
  ref(null);

const { possibleValues } = usePossibleValues(toRef(props, "control"));

const options = computed(() =>
  (staticOptions.value ?? possibleValues.value)?.map(disableOption),
);

onMounted(() => {
  staticOptions.value = props.control?.schema?.oneOf
    ? props.control.schema.oneOf.map(optionsMapper)
    : null;
});
</script>

<template>
  <component
    :is="uiComponent"
    v-if="options"
    :id="labelForId"
    :possible-values="options"
    :alignment="alignment"
    :disabled="disabled"
    :model-value="control.data"
    compact
    @update:model-value="changeValue"
  />
</template>
