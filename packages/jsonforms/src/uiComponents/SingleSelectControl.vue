<script setup lang="ts">
import { computed, toRef } from "vue";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";
import type { IdAndText } from "../types/ChoicesUiSchema";

import { usePossibleValues } from "./composables/usePossibleValues";
import LoadingDropdown from "./loading/LoadingDropdown.vue";

type SingleSelectValue =
  | { specialChoice: string }
  | { regularChoice: string }
  | { specialChoice: string; regularChoice: string }
  | undefined
  | null;

const props = defineProps<VueControlPropsForLabelContent<SingleSelectValue>>();

const specialChoices = computed<IdAndText[]>(
  () => props.control.uischema.options!.specialChoices,
);

const { possibleValues: regularChoices } = usePossibleValues(
  toRef(props, "control"),
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

type Choice = {
  id: SingleSelectId;
  text: string;
  isSpecial?: boolean;
};

const createSpecialChoice = ({
  id,
  text,
}: {
  id: string;
  text: string;
}): Choice => ({
  id: createSpecialId(id),
  text,
  isSpecial: true,
});

const createRegularChoice = ({
  id,
  text,
}: {
  id: string;
  text: string;
}): Choice => ({
  id: createRegularId(id),
  text,
});

const allChoices = computed<Choice[] | null>(() => {
  if (regularChoices.value === null) {
    return null;
  }
  return specialChoices.value
    .map(createSpecialChoice)
    .concat(regularChoices.value.map(createRegularChoice));
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
