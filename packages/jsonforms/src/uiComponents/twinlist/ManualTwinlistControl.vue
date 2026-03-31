<!-- eslint-disable no-undefined -->
<script setup lang="ts">
import { computed, toRef } from "vue";
import type { PartialDeep } from "type-fest";

import {
  KdsTwinList,
  type KdsTwinListPossibleValue,
  type KdsTypeIconName,
} from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import { mergeDeep } from "../../utils";
import {
  useIncludedExcludedLabels,
  usePossibleValues,
} from "../composables/usePossibleValues";

import useUnknownValuesInTwinlist from "./useUnknownValuesInTwinlist";

export type ManualTwinlistData = {
  manuallySelected: string[];
  manuallyDeselected: string[];
  includeUnknownColumns: boolean;
};

const props = defineProps<VueControlPropsForLabelContent<ManualTwinlistData>>();

const { excludedLabel, includedLabel } = useIncludedExcludedLabels(
  toRef(props, "control"),
);

let setManualFilterOnChange: (newData: ManualTwinlistData) => void;

const onChangeTwinlist = (obj: PartialDeep<ManualTwinlistData>) => {
  const newData = mergeDeep(props.control.data, obj) as ManualTwinlistData;
  props.changeValue(newData);
  setManualFilterOnChange?.(newData);
};

// --- Possible values ---

const { possibleValues } = usePossibleValues<{ type?: IdAndText }>(
  toRef(props, "control"),
);

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

const { selectedAndDeselected, setCurrentManualFilter } =
  useUnknownValuesInTwinlist({
    data: computed(() => ({ manualFilter: props.control.data })),
    possibleValueIds: computed(
      () => possibleValues.value?.map(({ id }) => id) ?? null,
    ),
  });
setManualFilterOnChange = (newData: ManualTwinlistData) => {
  setCurrentManualFilter(newData);
};

// --- Batched manual filter update ---

let pendingManualUpdate: PartialDeep<ManualTwinlistData> | null = null;

const flushManualUpdate = () => {
  if (pendingManualUpdate !== null) {
    const update = pendingManualUpdate;
    pendingManualUpdate = null;
    onChangeTwinlist(update);
  }
};

const queueManualChange = (partial: PartialDeep<ManualTwinlistData>) => {
  if (pendingManualUpdate === null) {
    pendingManualUpdate = partial;
    queueMicrotask(flushManualUpdate);
  } else {
    pendingManualUpdate = mergeDeep(
      pendingManualUpdate,
      partial,
    ) as PartialDeep<ManualTwinlistData>;
  }
};

const onManuallyIncludedChange = (included: string[]) => {
  queueManualChange({ manuallySelected: included });
};

const onManuallyExcludedChange = (excluded: string[]) => {
  queueManualChange({ manuallyDeselected: excluded });
};

const onIncludeUnknownValuesChange = (include: boolean | null) => {
  if (include !== null) {
    // Do not use onChangeTwinlist here: that would call setManualFilterOnChange
    // which marks the update as internal, causing useUnknownValuesInTwinlist to
    // skip refreshManualSelection. We need the composable to treat this as an
    // external change so it redistributes unknown columns between the two sides.
    const newData = mergeDeep(props.control.data, {
      includeUnknownColumns: include,
    } as PartialDeep<ManualTwinlistData>) as ManualTwinlistData;
    props.changeValue(newData);
  }
};

// --- Labels ---
</script>

<template>
  <KdsTwinList
    v-bind="$attrs"
    :id="labelForId"
    :ariaLabel="control.label"
    :disabled="disabled"
    :manually-included="selectedAndDeselected.selected ?? []"
    :manually-excluded="selectedAndDeselected.deselected ?? []"
    :include-unknown-values="control.data.includeUnknownColumns"
    :possible-values="kdsPossibleValues"
    :loading="selectedAndDeselected.selected === null"
    :exclude-label="excludedLabel ?? 'Excludes'"
    :include-label="includedLabel ?? 'Includes'"
    :error="!props.isValid"
    @update:manually-included="onManuallyIncludedChange"
    @update:manually-excluded="onManuallyExcludedChange"
    @update:include-unknown-values="onIncludeUnknownValuesChange"
  />
</template>
