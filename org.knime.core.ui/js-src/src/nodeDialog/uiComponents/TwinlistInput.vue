<!-- eslint-disable no-undefined -->
<!-- eslint-disable class-methods-use-this -->
<script setup lang="ts">
import { markRaw, type Ref, type Raw, ref, computed, watch } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { mergeDeep, getValuesInSet, getValuesNotInSet } from "../utils";
import MultiModeTwinlist from "webapps-common/ui/components/forms/MultiModeTwinlist.vue";
import inject from "../utils/inject";
import type { IdAndText, PossibleValue } from "../types/ChoicesUiSchema";
import type Control from "../types/Control";
import type { PartialDeep } from "type-fest";
import TwinlistLoadingInfo from "./loading/TwinlistLoadingInfo.vue";
import useDialogControl from "../composables/components/useDialogControl";
import LabeledInput from "./label/LabeledInput.vue";
import useProvidedState from "../composables/components/useProvidedState";
import { DefaultSettingComparator } from "@knime/ui-extension-service";
import { withSpecialChoices } from "../utils/getPossibleValuesFromUiSchema";

type TwinlistData = {
  mode: string;
  manualFilter: {
    manuallySelected: string[];
    manuallyDeselected: string[];
    includeUnknownColumns: boolean;
  };
  typeFilter: {
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

type ControlWithTwinlistData = {
  [P in keyof Control]: P extends "data" ? TwinlistData : Control[P];
};

const props = defineProps({
  ...rendererProps(),
  twinlistSize: {
    type: Number,
    required: false,
    default: 7,
  },
  twinlistLeftLabel: {
    type: String,
    required: false,
    default: "Excludes",
  },
  twinlistRightLabel: {
    type: String,
    required: false,
    default: "Includes",
  },
});

const subConfigKeys = [
  "mode",
  "patterFilter.pattern",
  "patternFilter.isCaseSensitive",
  "patternFilter.isInverted",
  "manualFilter.manuallySelected",
  "manualFilter.manuallyDeselected",
  "manualFilter.includeUnknownColumns",
  "typeFilter.selectedTypes",
];

class TwinlistValueComparator extends DefaultSettingComparator<
  TwinlistData | undefined,
  string
> {
  toInternalState(cleanSettings: TwinlistData | undefined): string {
    return JSON.stringify(cleanSettings, (key, value) =>
      key === "selected" ? undefined : value,
    );
  }

  equals(newState: string, cleanState: string): boolean {
    return newState === cleanState;
  }
}

const {
  control: untypedControl,
  disabled,
  onChange: onChangeControl,
} = useDialogControl<TwinlistData | undefined>({
  props,
  subConfigKeys,
  valueComparator: new TwinlistValueComparator(),
});
const control = untypedControl as Ref<ControlWithTwinlistData>;

const onChange = (obj: PartialDeep<TwinlistData>) => {
  const newData = mergeDeep(control.value.data, obj) as TwinlistData;
  onChangeControl(newData);
};
const onSelectedChange = ({
  selected,
  isManual,
  deselected,
}: {
  selected: string[];
  isManual: boolean;
  deselected: string[];
}) => {
  onChange({
    selected,
    ...(isManual
      ? {
          manualFilter: {
            manuallySelected: selected,
            manuallyDeselected: deselected,
          },
        }
      : {}),
  });
};
const onIncludeUnknownColumnsChange = (includeUnknownColumns: boolean) => {
  onChange({ manualFilter: { includeUnknownColumns } });
};
const onPatternChange = (pattern: string) => {
  onChange({ patternFilter: { pattern } });
};
const onModeChange = (mode: string) => {
  onChange({ mode: mode.toUpperCase() });
};
const onSelectedTypesChange = (
  selectedTypes: string[],
  typeDisplays: IdAndText[],
) => {
  onChange({ typeFilter: { selectedTypes, typeDisplays } });
};
const onInversePatternChange = (isInverted: boolean) => {
  onChange({ patternFilter: { isInverted } });
};
const onCaseSensitiveChange = (isCaseSensitive: boolean) => {
  onChange({ patternFilter: { isCaseSensitive } });
};

// Initial updates

const loadingInfo = ref(markRaw(TwinlistLoadingInfo) as Raw<any> | null);
const choicesProvider = computed<string | undefined>(
  () => control.value.uischema.options?.choicesProvider,
);
const possibleValues = withSpecialChoices(
  useProvidedState<PossibleValue[]>(choicesProvider, []),
  control.value,
);
const previouslySelectedTypes = ref<IdAndText[]>([]);
const initialManuallySelected = ref(null as null | string[]);
/**
 *  add unknown columns either to the manually selected or manually deselected
 * @param {string[]} possibleValueIds the possible values from which unknown values are determined.
 * @returns {void}.
 */
const setInitialManuallySelected = (possibleValueIds: string[]) => {
  const { manuallySelected, manuallyDeselected, includeUnknownColumns } =
    control.value.data.manualFilter;

  const includedPossibleValueIds = includeUnknownColumns //
    ? getValuesNotInSet(possibleValueIds, new Set(manuallyDeselected)) //
    : getValuesInSet(possibleValueIds, new Set(manuallySelected));

  initialManuallySelected.value = [
    ...getValuesNotInSet(manuallySelected, new Set(includedPossibleValueIds)),
    ...includedPossibleValueIds,
  ];
  loadingInfo.value = null;
};

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
  const selectedTypesIds = control.value.data.typeFilter.selectedTypes;
  const selectedTypesToDisplayedText = typeDisplaysToMap(
    control.value.data.typeFilter.typeDisplays,
  );
  return selectedTypesIds.map((id) => ({
    id,
    text: selectedTypesToDisplayedText[id] || id,
  }));
};

previouslySelectedTypes.value = getPreviouslySelectedTypes();

if (!choicesProvider.value) {
  inject("getPossibleValuesFromUiSchema")(control.value).then((result) => {
    possibleValues.value = result;
  });
}

/**
 * Needed to freshly mount the TwinList whenever new possible values come in,
 * because it is not reactive in the initially manually selected prop.
 */
const refreshKey = ref(0);

watch(
  () => possibleValues.value,
  (newPossibleValues: IdAndText[]) => {
    const refreshNeeded = loadingInfo.value === null;
    setInitialManuallySelected(newPossibleValues.map(({ id }) => id));
    if (refreshNeeded) {
      refreshKey.value++;
    }
  },
);

// Hiding controls

const withTypes = computed(() =>
  Boolean(possibleValues.value[0]?.hasOwnProperty("type")),
);
const showMode = computed(
  () => control.value.uischema.options?.showMode ?? true,
);
const showSearch = computed(
  () => control.value.uischema.options?.showSearch ?? true,
);

const leftLabel = computed(
  () =>
    control.value.uischema.options?.excludedLabel ?? props.twinlistLeftLabel,
);
const rightLabel = computed(
  () =>
    control.value.uischema.options?.includedLabel ?? props.twinlistRightLabel,
);
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <MultiModeTwinlist
      v-bind="$attrs"
      :id="labelForId"
      :key="refreshKey"
      :show-mode="showMode"
      :show-search="showSearch"
      :disabled="disabled"
      :with-types="withTypes"
      :initial-selected-types="control.data.typeFilter.selectedTypes"
      :additional-possible-types="previouslySelectedTypes"
      :initial-pattern="control.data.patternFilter.pattern"
      :initial-mode="control.data.mode.toLowerCase()"
      :initial-case-sensitive-pattern="
        control.data.patternFilter.isCaseSensitive
      "
      :empty-state-component="loadingInfo"
      :initial-inverse-pattern="control.data.patternFilter.isInverted"
      :initial-manually-selected="initialManuallySelected"
      :initial-include-unknown-values="
        control.data.manualFilter.includeUnknownColumns
      "
      :filter-chosen-values-on-possible-values-change="false"
      mode-label="Selection mode"
      :possible-values="possibleValues"
      :size="twinlistSize"
      :left-label="leftLabel"
      :right-label="rightLabel"
      @input="onSelectedChange"
      @include-unknown-values-input="onIncludeUnknownColumnsChange"
      @pattern-input="onPatternChange"
      @mode-input="onModeChange"
      @types-input="onSelectedTypesChange"
      @inverse-pattern-input="onInversePatternChange"
      @case-sensitive-pattern-input="onCaseSensitiveChange"
    />
  </LabeledInput>
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
