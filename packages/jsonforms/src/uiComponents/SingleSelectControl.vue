<!-- eslint-disable class-methods-use-this -->
<script setup lang="ts">
import { computed } from "vue";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";
import type { IdAndText } from "../types/ChoicesUiSchema";

import useProvidedState from "./composables/useProvidedState";
import LoadingDropdown from "./loading/LoadingDropdown.vue";

type SingleSelectValue =
  | { specialChoice: string }
  | { regularChoice: string }
  | { specialChoice: string; regularChoice: string }
  | undefined
  | null;

const props = defineProps<VueControlPropsForLabelContent<SingleSelectValue>>();

const choicesProvider = computed<string>(
  () => props.control.uischema.options!.choicesProvider,
);

const specialChoices = computed<IdAndText[]>(
  () => props.control.uischema.options!.specialChoices,
);

const regularChoices = useProvidedState<null | IdAndText[]>(
  choicesProvider,
  null,
);

const specialPrefix = "__special__" as const;
const regularPrefix = "__regular__" as const;

type SingleSelectId =
  | `${typeof specialPrefix}${string}`
  | `${typeof regularPrefix}${string}`
  | "";

const createSpecialId = (specialChoice: string): SingleSelectId =>
  `${specialPrefix}${specialChoice}`;
const createRegularId = (regularChoice: string): SingleSelectId =>
  `${regularPrefix}${regularChoice}`;

const allChoices = computed<
  | {
      id: SingleSelectId;
      text: string;
    }[]
  | null
>(() => {
  if (regularChoices.value === null) {
    return null;
  }
  return specialChoices.value
    .map(({ id, text }) => ({
      id: createSpecialId(id),
      text,
    }))
    .concat(
      regularChoices.value.map(({ id, text }) => ({
        id: createRegularId(id),
        text,
      })),
    );
});

const assertIsSingleSelectId = (id: string) => {
  if (!id.startsWith(regularPrefix) && !id.startsWith(specialPrefix)) {
    throw new Error(`Expected id to start with ${regularPrefix}`);
  }
};
const toSingleSelectValue = (value: string | null): SingleSelectValue => {
  if (!value) {
    return null;
  }
  assertIsSingleSelectId(value);
  if (value.startsWith(specialPrefix)) {
    return { specialChoice: value.slice(specialPrefix.length) };
  }
  return { regularChoice: value.slice(regularPrefix.length) };
};

const toSingleSelectId = (
  singleSelectValue: SingleSelectValue,
): SingleSelectId => {
  if (typeof singleSelectValue === "undefined" || singleSelectValue === null) {
    return "";
  }
  if ("regularChoice" in singleSelectValue && singleSelectValue.regularChoice) {
    return createRegularId(singleSelectValue.regularChoice);
  }
  if ("specialChoice" in singleSelectValue && singleSelectValue.specialChoice) {
    return createSpecialId(singleSelectValue.specialChoice);
  }
  return "";
};

const modelValue = computed<string>({
  get: () => toSingleSelectId(props.control.data),
  set: (value) => {
    props.changeValue(toSingleSelectValue(value));
  },
});
</script>

<template>
  <!-- eslint-disable vue/attribute-hyphenation typescript complains with ':aria-label' instead of ':ariaLabel'-->
  <LoadingDropdown
    :id="labelForId"
    v-model="modelValue"
    :possible-values="allChoices"
    :ariaLabel="control.label"
    :disabled="disabled"
    compact
  />
</template>
