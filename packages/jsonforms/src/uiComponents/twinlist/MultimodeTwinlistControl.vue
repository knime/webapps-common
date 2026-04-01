<!-- eslint-disable no-undefined -->
<script setup lang="ts">
import { computed, toRef } from "vue";
import type { PartialDeep } from "type-fest";

import {
  KdsTwinList,
  type KdsTwinListPossibleType,
  type KdsTwinListPossibleValue,
  type KdsTwinListSearchMode,
  type KdsTypeIconName,
  kdsTwinListSearchMode,
} from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import { mergeDeep } from "../../utils";
import {
  useIncludedExcludedLabels,
  usePossibleValues,
} from "../composables/usePossibleValues";

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
      twinlistLeftLabel?: string;
      showUnknownValues?: boolean;
      twinlistRightLabel?: string;
      showTypeFilter?: boolean;
    }
  >(),
  {
    twinlistLeftLabel: "Excludes",
    showUnknownValues: false,
    twinlistRightLabel: "Includes",
    showTypeFilter: false,
  },
);

const { possibleValues } = usePossibleValues<{ type?: IdAndText }>(
  toRef(props, "control"),
);

const { excludedLabel, includedLabel } = useIncludedExcludedLabels(
  toRef(props, "control"),
);

const { selectedAndDeselected, setCurrentManualFilter } =
  useUnknownValuesInTwinlist({
    data: computed(() => props.control.data),
    possibleValueIds: computed(
      () => possibleValues.value?.map(({ id }) => id) ?? null,
    ),
  });

const onChangeTwinlist = (obj: PartialDeep<TwinlistData>) => {
  const newData = mergeDeep(props.control.data, obj) as TwinlistData;
  props.changeValue(newData);
  setCurrentManualFilter(newData.manualFilter);
};

// --- Possible values ---

const kdsPossibleValues = computed<KdsTwinListPossibleValue[]>(() =>
  (possibleValues.value ?? []).map((v) => ({
    id: v.id,
    text: v.text,
    ...(v.type
      ? {
          type: v.type.id,
          accessory: {
            type: "dataType" as const,
            name: v.type.id as KdsTypeIconName,
          },
        }
      : {}),
  })),
);

// --- Unknown values / manual selection ---

// --- Batched manual filter update ---
// KdsTwinList emits update:manuallyIncluded and update:manuallyExcluded
// separately but synchronously. Batch them into a single changeValue call.

let pendingManualUpdate: PartialDeep<TwinlistData> | null = null;

const flushManualUpdate = () => {
  if (pendingManualUpdate !== null) {
    const update = pendingManualUpdate;
    pendingManualUpdate = null;
    onChangeTwinlist(update);
  }
};

const queueManualChange = (partial: PartialDeep<TwinlistData>) => {
  if (pendingManualUpdate === null) {
    pendingManualUpdate = partial;
    queueMicrotask(flushManualUpdate);
  } else {
    pendingManualUpdate = mergeDeep(
      pendingManualUpdate,
      partial,
    ) as PartialDeep<TwinlistData>;
  }
};

const onManuallyIncludedChange = (included: string[]) => {
  queueManualChange({
    manualFilter: { manuallySelected: included },
    selected: included,
  });
};

const onManuallyExcludedChange = (excluded: string[]) => {
  queueManualChange({
    manualFilter: { manuallyDeselected: excluded },
  });
};

const onIncludeUnknownValuesChange = (include: boolean | null) => {
  if (include !== null) {
    queueManualChange({
      manualFilter: { includeUnknownColumns: include },
    });
  }
};

// --- Mode mapping ---
// Backend: MANUAL | WILDCARD | REGEX | TYPE
// KDS:     manual | pattern | type  (+ useRegex flag)

const kdsMode = computed<KdsTwinListSearchMode>(() => {
  const backendMode = props.control.data.mode.toUpperCase();
  switch (backendMode) {
    case "WILDCARD":
    case "REGEX":
      return kdsTwinListSearchMode.PATTERN;
    case "TYPE":
      return kdsTwinListSearchMode.TYPE;
    default:
      return kdsTwinListSearchMode.MANUAL;
  }
});

const kdsUseRegex = computed(
  () => props.control.data.mode.toUpperCase() === "REGEX",
);

const onModeChange = (mode: KdsTwinListSearchMode) => {
  let backendMode: string;
  switch (mode) {
    case kdsTwinListSearchMode.PATTERN:
      backendMode = kdsUseRegex.value ? "REGEX" : "WILDCARD";
      break;
    case kdsTwinListSearchMode.TYPE:
      backendMode = "TYPE";
      break;
    default:
      backendMode = "MANUAL";
  }
  onChangeTwinlist({ mode: backendMode });
};

const onUseRegexChange = (useRegex: boolean) => {
  if (kdsMode.value === kdsTwinListSearchMode.PATTERN) {
    onChangeTwinlist({ mode: useRegex ? "REGEX" : "WILDCARD" });
  }
};

// --- Pattern filter ---

const onPatternChange = (pattern: string) => {
  onChangeTwinlist({ patternFilter: { pattern } });
};

const onExcludeMatchesChange = (isInverted: boolean) => {
  onChangeTwinlist({ patternFilter: { isInverted } });
};

const onCaseSensitiveChange = (isCaseSensitive: boolean) => {
  onChangeTwinlist({ patternFilter: { isCaseSensitive } });
};

// --- Type filter ---

const getPreviouslySelectedTypes = (): IdAndText[] => {
  const typeFilter = props.control.data.typeFilter;
  if (!typeFilter) {
    return [];
  }
  const selectedTypesIds = typeFilter.selectedTypes;
  const typeDisplaysMap = new Map(
    (typeFilter.typeDisplays ?? []).map(({ id, text }) => [id, text]),
  );
  return selectedTypesIds.map((id) => ({
    id,
    text: typeDisplaysMap.get(id) || id,
  }));
};

const filterTypes = computed<KdsTwinListPossibleType[] | undefined>(() => {
  if (!props.showTypeFilter) {
    return undefined;
  }
  const typeMap = new Map<string, string>();
  // Types from possible values
  possibleValues.value?.forEach((v) => {
    if (v.type) {
      typeMap.set(v.type.id, v.type.text);
    }
  });
  // Previously selected types not in possibleValues
  getPreviouslySelectedTypes().forEach(({ id, text }) => {
    if (!typeMap.has(id)) {
      typeMap.set(id, text);
    }
  });
  return [...typeMap.entries()].map(([id, text]) => ({
    id,
    text,
    accessory: { type: "dataType" as const, name: id as KdsTypeIconName },
  }));
});

const onSelectedTypesChange = (newSelectedTypes: string[]) => {
  const typeDisplays = (filterTypes.value ?? [])
    .filter((t) => newSelectedTypes.includes(t.id))
    .map(({ id, text }) => ({ id, text }));
  onChangeTwinlist({
    typeFilter: { selectedTypes: newSelectedTypes, typeDisplays },
  });
};
</script>

<template>
  <KdsTwinList
    v-bind="$attrs"
    :id="labelForId"
    :ariaLabel="control.label"
    :disabled="disabled"
    :mode="kdsMode"
    :manually-included="selectedAndDeselected.selected ?? []"
    :manually-excluded="selectedAndDeselected.deselected ?? []"
    :include-unknown-values="
      props.showUnknownValues
        ? props.control.data.manualFilter.includeUnknownColumns
        : null
    "
    :pattern="control.data.patternFilter.pattern"
    :case-sensitive="control.data.patternFilter.isCaseSensitive"
    :exclude-matches="control.data.patternFilter.isInverted"
    :use-regex="kdsUseRegex"
    :selected-types="control.data.typeFilter?.selectedTypes ?? []"
    :possible-values="kdsPossibleValues"
    :filter-types="filterTypes"
    :enable-pattern-filter="true"
    :loading="selectedAndDeselected.selected === null"
    :exclude-label="excludedLabel ?? props.twinlistLeftLabel"
    :include-label="includedLabel ?? props.twinlistRightLabel"
    :error="!props.isValid"
    @update:mode="onModeChange"
    @update:manually-included="onManuallyIncludedChange"
    @update:manually-excluded="onManuallyExcludedChange"
    @update:include-unknown-values="onIncludeUnknownValuesChange"
    @update:pattern="onPatternChange"
    @update:case-sensitive="onCaseSensitiveChange"
    @update:exclude-matches="onExcludeMatchesChange"
    @update:use-regex="onUseRegexChange"
    @update:selected-types="onSelectedTypesChange"
  />
</template>
