<!-- eslint-disable no-undefined -->
<!-- eslint-disable class-methods-use-this -->
<script setup lang="ts">
import { computed, markRaw, ref } from "vue";
import type { PartialDeep } from "type-fest";

import type { TwinlistModelValue } from "@knime/components";
import { MultiModeTwinList } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";
import type { IdAndText, PossibleValue } from "../../types/ChoicesUiSchema";
import { mergeDeep } from "../../utils";
import inject from "../../utils/inject";
import useProvidedState from "../composables/useProvidedState";
import TwinlistLoadingInfo from "../loading/TwinlistLoadingInfo.vue";

import useUnknownValuesInTwinlist from "./useUnknownValuesInTwinlist";

export type TwinlistData = {
  mode: string;
  manualFilter: {
    manuallySelected: string[];
    manuallyDeselected: string[];
    includeUnknownColumns: boolean;
  };
  typeFilter?: {
    selectedTypes: string[];
    typeDisplays: IdAndText[] | undefined;
  };
  patternFilter: {
    pattern: string;
    isInverted: boolean;
    isCaseSensitive: boolean;
  };
  selected: string[] | null | undefined;
};

const props = withDefaults(
  defineProps<
    VueControlPropsForLabelContent<TwinlistData> & {
      twinlistSize?: number;
      twinlistLeftLabel?: string;
      showUnknownValues?: boolean;
      twinlistRightLabel?: string;
    }
  >(),
  {
    twinlistSize: 10,
    twinlistLeftLabel: "Excludes",
    showUnknownValues: false,
    twinlistRightLabel: "Includes",
  },
);

// TODO: use const instead of let (prefer-const) requires initializing
let setManualFilterOnChange: (newData: TwinlistData["manualFilter"]) => void;

const onChangeTwinlist = (obj: PartialDeep<TwinlistData>) => {
  const newData = mergeDeep(props.control.data, obj) as TwinlistData;
  props.changeValue(newData);
  setManualFilterOnChange?.(newData.manualFilter);
};
const onSelectedChange = (selected: string[]) => {
  onChangeTwinlist({ selected });
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
      manualFilter: {
        manuallySelected: includedValues,
        manuallyDeselected: excludedValues,
        includeUnknownColumns: includeUnknownValues,
      },
    });
  } else {
    onChangeTwinlist({ manualFilter: { manuallySelected: manualSelection } });
  }
};

const onPatternChange = (pattern: string) => {
  onChangeTwinlist({ patternFilter: { pattern } });
};
const onModeChange = (mode: string) => {
  onChangeTwinlist({ mode: mode.toUpperCase() });
};
const onSelectedTypesChange = (
  selectedTypes: string[],
  typeDisplays: IdAndText[],
) => {
  onChangeTwinlist({ typeFilter: { selectedTypes, typeDisplays } });
};
const onInversePatternChange = (isInverted: boolean) => {
  onChangeTwinlist({ patternFilter: { isInverted } });
};
const onCaseSensitiveChange = (isCaseSensitive: boolean) => {
  onChangeTwinlist({ patternFilter: { isCaseSensitive } });
};

// Initial updates

const choicesProvider = computed<string | undefined>(
  () => props.control.uischema.options?.choicesProvider,
);
const possibleValues = useProvidedState<PossibleValue[] | null>(
  choicesProvider,
  null,
);
const previouslySelectedTypes = ref<IdAndText[]>([]);

const { selectedAndDeselected, setCurrentManualFilter } =
  useUnknownValuesInTwinlist({
    data: computed(() => props.control.data),
    possibleValueIds: computed(
      () => possibleValues.value?.map(({ id }) => id) ?? null,
    ),
  });
setManualFilterOnChange = setCurrentManualFilter;

const manualSelection = computed<ManualSelection>(() => {
  const { selected, deselected } = selectedAndDeselected.value;
  if (props.showUnknownValues) {
    return {
      includedValues: selected,
      excludedValues: deselected,
      includeUnknownValues:
        props.control.data.manualFilter.includeUnknownColumns,
    };
  }
  return selected;
});

const loadingInfo = computed(() =>
  selectedAndDeselected.value.selected === null
    ? (markRaw(TwinlistLoadingInfo) as any)
    : null,
);

const typeDisplaysToMap = (keyValuePairs: IdAndText[] | undefined) => {
  if (typeof keyValuePairs === "undefined") {
    return {};
  }
  return keyValuePairs.reduce(
    (obj, { id, text }) => ({ ...obj, [id]: text }),
    {} as Record<string, string>,
  );
};

const getPreviouslySelectedTypes = () => {
  const typeFilter = props.control.data.typeFilter;
  if (!typeFilter) {
    return [];
  }
  const selectedTypesIds = typeFilter.selectedTypes;
  const selectedTypesToDisplayedText = typeDisplaysToMap(
    typeFilter.typeDisplays,
  );
  return selectedTypesIds.map((id) => ({
    id,
    text: selectedTypesToDisplayedText[id] || id,
  }));
};

previouslySelectedTypes.value = getPreviouslySelectedTypes();

if (!choicesProvider.value) {
  inject("getPossibleValuesFromUiSchema")(props.control).then((result) => {
    possibleValues.value = result;
  });
}

// Hiding controls

const withTypes = computed(() =>
  Boolean(possibleValues.value?.[0]?.hasOwnProperty("type")),
);

const leftLabel = computed(
  () =>
    props.control.uischema.options?.excludedLabel ?? props.twinlistLeftLabel,
);
const rightLabel = computed(
  () =>
    props.control.uischema.options?.includedLabel ?? props.twinlistRightLabel,
);
</script>

<template>
  <MultiModeTwinList
    v-bind="$attrs"
    :id="labelForId"
    :disabled="disabled"
    :with-types="withTypes"
    :selected-types="control.data.typeFilter?.selectedTypes"
    :additional-possible-types="previouslySelectedTypes"
    :pattern="control.data.patternFilter.pattern"
    :mode="control.data.mode.toLowerCase()"
    :case-sensitive-pattern="control.data.patternFilter.isCaseSensitive"
    :empty-state-component="loadingInfo"
    :inverse-pattern="control.data.patternFilter.isInverted"
    :manual-selection="manualSelection"
    :include-unknown-values="control.data.manualFilter.includeUnknownColumns"
    mode-label="Selection mode"
    :possible-values="possibleValues ?? []"
    :size="twinlistSize"
    :left-label="leftLabel"
    :right-label="rightLabel"
    :is-valid
    compact
    show-resize-handle
    @update:selected="onSelectedChange"
    @update:manual-selection="onManualSelectionChange"
    @update:pattern="onPatternChange"
    @update:mode="onModeChange"
    @update:selected-types="onSelectedTypesChange"
    @update:inverse-pattern="onInversePatternChange"
    @update:case-sensitive-pattern="onCaseSensitiveChange"
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
