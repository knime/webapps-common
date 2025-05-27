<!-- eslint-disable no-undefined -->
<!-- eslint-disable class-methods-use-this -->
<script setup lang="ts">
import { computed, markRaw, toRef } from "vue";
import type { PartialDeep } from "type-fest";

import type { TwinlistModelValue } from "@knime/components";
import { Twinlist } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import { mergeDeep } from "../../utils";
import {
  useIncludedExcludedLabels,
  usePossibleValues,
} from "../composables/usePossibleValues";
import TwinlistLoadingInfo from "../loading/TwinlistLoadingInfo.vue";

import useUnknownValuesInTwinlist from "./useUnknownValuesInTwinlist";

export type ManualTwinlistData = {
  manuallySelected: string[];
  manuallyDeselected: string[];
  includeUnknownColumns: boolean;
};

const props = defineProps<VueControlPropsForLabelContent<ManualTwinlistData>>();

// TODO: use const instead of let (prefer-const) requires initializing
let setManualFilterOnChange: (newData: ManualTwinlistData) => void;

const onChangeTwinlist = (obj: PartialDeep<ManualTwinlistData>) => {
  const newData = mergeDeep(props.control.data, obj) as ManualTwinlistData;
  props.changeValue(newData);
  setManualFilterOnChange?.(newData);
};

type ManualSelection = TwinlistModelValue<string>;

const onManualSelectionChange = (manualSelection: ManualSelection) => {
  if (manualSelection === null) {
    return;
  }
  if ("includedValues" in manualSelection) {
    const { includedValues, excludedValues, includeUnknownValues } =
      manualSelection;
    if (!includedValues || !excludedValues) {
      return;
    }
    onChangeTwinlist({
      manuallySelected: includedValues,
      manuallyDeselected: excludedValues,
      includeUnknownColumns: includeUnknownValues,
    });
  } else {
    onChangeTwinlist({ manuallySelected: manualSelection });
  }
};

// Initial updates

const { possibleValues } = usePossibleValues<{ type?: IdAndText }>(
  toRef(props, "control"),
);
const { selectedAndDeselected, setCurrentManualFilter } =
  useUnknownValuesInTwinlist({
    data: computed(() => ({ manualFilter: props.control.data })),
    possibleValueIds: computed(
      () => possibleValues.value?.map(({ id }) => id) ?? null,
    ),
  });
setManualFilterOnChange = setCurrentManualFilter;

const manualSelection = computed<ManualSelection>(() => {
  const { selected, deselected } = selectedAndDeselected.value;
  return {
    includedValues: selected,
    excludedValues: deselected,
    includeUnknownValues: props.control.data.includeUnknownColumns,
  };
});

const loadingInfo = computed(() =>
  selectedAndDeselected.value.selected === null
    ? (markRaw(TwinlistLoadingInfo) as any)
    : null,
);

const { excludedLabel, includedLabel } = useIncludedExcludedLabels(
  toRef(props, "control"),
);
const leftLabel = computed(() => excludedLabel ?? "Excludes");
const rightLabel = computed(() => includedLabel ?? "Includes");
const twinlistSize = computed(
  () => props.control.uischema.options?.twinlistSize,
);
</script>

<template>
  <Twinlist
    v-bind="$attrs"
    :id="labelForId"
    show-search
    :disabled="disabled"
    :empty-state-component="loadingInfo"
    :model-value="manualSelection"
    :possible-values="possibleValues ?? []"
    :size="twinlistSize"
    :left-label="leftLabel"
    :right-label="rightLabel"
    :is-valid
    compact
    show-resize-handle
    @update:model-value="onManualSelectionChange"
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
