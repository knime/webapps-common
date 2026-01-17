<script setup lang="ts">
import { type Ref, computed, onMounted, ref, toRef } from "vue";

import { KdsRadioButtonGroup, KdsValueSwitch } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";
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
const disableOption = (option: IdAndText): PossiblyDisabledOption => ({
  id: option.id,
  text: option.text,
  ...(option.disabled ? { disabled: true as const } : {}),
});

const staticOptions: Ref<PossiblyDisabledOption[] | null | undefined> =
  ref(null);

const { possibleValues } = usePossibleValues(toRef(props, "control"), {
  defaultOnNonProvided: null,
});

const options = computed(() =>
  (possibleValues.value ?? staticOptions.value)?.map(disableOption),
);

onMounted(() => {
  staticOptions.value = props.control?.schema?.oneOf
    ? props.control.schema.oneOf.map(optionsMapper)
    : null;
});
</script>

<template>
  <template v-if="options">
    <KdsValueSwitch
      v-if="props.type === 'valueSwitch'"
      :id="labelForId"
      :possible-values="options"
      :disabled="disabled"
      :model-value="control.data"
      size="small"
      @update:model-value="changeValue"
    />
    <KdsRadioButtonGroup
      v-else
      :id="labelForId"
      :possible-values="options"
      :alignment="alignment"
      :disabled="disabled"
      :model-value="control.data"
      @update:model-value="changeValue"
    />
  </template>
</template>
