<script lang="ts">
import type {
  IdAndText,
  PossibleValue,
} from "@/nodeDialog//types/ChoicesUiSchema";
import type { TwinlistModelValue } from "webapps-common/ui/components/forms/Twinlist.vue";
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
</script>

<!-- eslint-disable no-undefined -->
<!-- eslint-disable class-methods-use-this -->
<script setup lang="ts">
import { markRaw, type Ref, ref, computed } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { mergeDeep } from "@/nodeDialog/utils";
import MultiModeTwinlist from "webapps-common/ui/components/forms/MultiModeTwinlist.vue";
import inject from "@/nodeDialog/utils/inject";

import type Control from "@/nodeDialog/types/Control";
import type { PartialDeep } from "type-fest";
import TwinlistLoadingInfo from "../loading/TwinlistLoadingInfo.vue";
import useDialogControl from "@/nodeDialog/composables/components/useDialogControl";
import LabeledInput from "../label/LabeledInput.vue";
import useProvidedState from "@/nodeDialog/composables/components/useProvidedState";
import { DefaultSettingComparator } from "@knime/ui-extension-service";
import { withSpecialChoices } from "@/nodeDialog/utils/getPossibleValuesFromUiSchema";
import useUnknownValuesInTwinlist from "./useUnknownValuesInTwinlist";

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
  showUnknownValues: {
    type: Boolean,
    default: false,
  },
  twinlistRightLabel: {
    type: String,
    required: false,
    default: "Includes",
  },
});

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
  valueComparator: new TwinlistValueComparator(),
});
const control = untypedControl as Ref<ControlWithTwinlistData>;

let setManualFilterOnChange: (newData: TwinlistData["manualFilter"]) => void;

const onChange = (obj: PartialDeep<TwinlistData>) => {
  const newData = mergeDeep(control.value.data, obj) as TwinlistData;
  onChangeControl(newData);
  setManualFilterOnChange?.(newData.manualFilter);
};
const onSelectedChange = (selected: string[]) => {
  onChange({ selected });
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
    onChange({
      manualFilter: {
        manuallySelected: includedValues,
        manuallyDeselected: excludedValues,
        includeUnknownColumns: includeUnknownValues,
      },
    });
  } else {
    onChange({ manualFilter: { manuallySelected: manualSelection } });
  }
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

const choicesProvider = computed<string | undefined>(
  () => control.value.uischema.options?.choicesProvider,
);
const possibleValues = withSpecialChoices(
  useProvidedState<PossibleValue[] | null>(choicesProvider, null),
  control.value,
);
const previouslySelectedTypes = ref<IdAndText[]>([]);

const { selectedAndDeselected, setCurrentManualFilter } =
  useUnknownValuesInTwinlist({
    data: computed(() => control.value.data),
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
        control.value.data.manualFilter.includeUnknownColumns,
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
  const typeFilter = control.value.data.typeFilter;
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
  inject("getPossibleValuesFromUiSchema")(control.value).then((result) => {
    possibleValues.value = result;
  });
}

// Hiding controls

const withTypes = computed(() =>
  Boolean(possibleValues.value?.[0]?.hasOwnProperty("type")),
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
      :show-mode="showMode"
      :show-search="showSearch"
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
      :filter-chosen-values-on-possible-values-change="false"
      mode-label="Selection mode"
      :possible-values="possibleValues ?? []"
      :size="twinlistSize"
      :left-label="leftLabel"
      :right-label="rightLabel"
      compact
      @update:selected="onSelectedChange"
      @update:manual-selection="onManualSelectionChange"
      @update:pattern="onPatternChange"
      @update:mode="onModeChange"
      @update:selected-types="onSelectedTypesChange"
      @update:inverse-pattern="onInversePatternChange"
      @update:case-sensitive-pattern="onCaseSensitiveChange"
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
