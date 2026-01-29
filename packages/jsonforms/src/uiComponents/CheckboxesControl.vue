<script setup lang="ts">
import { type Ref, computed, onMounted, ref, toRef } from "vue";

import { KdsCheckboxGroup } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../higherOrderComponents";
import type { IdAndText } from "../types/ChoicesUiSchema";
import { optionsMapper } from "../utils";

import { usePossibleValues } from "./composables/usePossibleValues";

const props = defineProps<VueControlPropsForLabelContent<string[]>>();

const alignment = computed(
  () => props.control.uischema.options?.checkboxLayout,
);

const staticOptions: Ref<IdAndText[] | null> = ref(null);

const { possibleValues } = usePossibleValues(toRef(props, "control"));

const options = computed(() => staticOptions.value ?? possibleValues.value);

// KdsCheckboxGroup expects validation state per option via `option.error`.
// Previously we had a single `:is-valid` prop for the full group; we emulate the same
// behavior by marking all options as errored when the control is invalid.
const optionsWithError = computed(() =>
  (options.value ?? []).map((option) => ({ ...option, error: !props.isValid })),
);

onMounted(() => {
  staticOptions.value = props.control.schema.anyOf
    ? props.control.schema.anyOf.map(optionsMapper)
    : null;
});
</script>

<template>
  <KdsCheckboxGroup
    v-if="options"
    :id="labelForId"
    class="checkboxes"
    :possible-values="optionsWithError"
    :alignment="alignment"
    :disabled="disabled"
    :model-value="control.data"
    @update:model-value="changeValue"
  />
</template>

<style lang="postcss" scoped>
.checkboxes {
  margin-bottom: -10px;
}
</style>
