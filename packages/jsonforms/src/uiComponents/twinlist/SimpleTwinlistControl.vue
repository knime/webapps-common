<script setup lang="ts">
import { computed, markRaw } from "vue";

import { Twinlist } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import type { Control } from "../../types/Control";
import inject from "../../utils/inject";
import useProvidedState from "../composables/useProvidedState";
import TwinlistLoadingInfo from "../loading/TwinlistLoadingInfo.vue";

const props = withDefaults(
  defineProps<
    VueControlPropsForLabelContent<string[]> & {
      twinlistSize?: number;
      twinlistLeftLabel?: string;
      twinlistRightLabel?: string;
      optionsGenerator?: null | ((control: Control) => IdAndText[]);
    }
  >(),
  {
    twinlistSize: 10,
    twinlistLeftLabel: "Excludes",
    twinlistRightLabel: "Includes",
    optionsGenerator: null,
  },
);

const getPossibleValuesFromUiSchema = inject("getPossibleValuesFromUiSchema");

const choicesProvider = computed(
  () => props.control.uischema.options?.choicesProvider,
);
const possibleValues = useProvidedState<null | IdAndText[]>(
  choicesProvider,
  null,
);
const TwinlistLoadingInfoRaw = markRaw(TwinlistLoadingInfo) as any;

if (!choicesProvider.value) {
  if (props.optionsGenerator === null) {
    getPossibleValuesFromUiSchema(props.control).then((result) => {
      possibleValues.value = result;
    });
  } else {
    possibleValues.value = props.optionsGenerator(props.control);
  }
}
</script>

<template>
  <Twinlist
    :id="labelForId"
    :disabled="disabled"
    :model-value="control.data"
    :possible-values="possibleValues ?? []"
    :empty-state-component="
      possibleValues === null ? TwinlistLoadingInfoRaw : null
    "
    :hide-options="possibleValues === null"
    :size="twinlistSize"
    :left-label="twinlistLeftLabel"
    :right-label="twinlistRightLabel"
    :is-valid
    compact
    show-resize-handle
    @update:model-value="changeValue"
  />
</template>

<style lang="postcss" scoped>
.twinlist :deep(.lists) :deep(.multiselect-list-box) :deep([role="listbox"]) {
  font-size: 13px;
}

.twinlist :deep(.header) :deep(.title) {
  font-size: 13px;
  font-weight: 500;
  color: var(--knime-dove-gray);
}
</style>
