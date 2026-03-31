<script setup lang="ts">
import { computed, toRef } from "vue";

import {
  KdsTwinList,
  type KdsTwinListPossibleValue,
  type KdsTypeIconName,
} from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents";
import type { TypedIdAndText } from "../../types/ChoicesUiSchema";
import { useIncludedExcludedLabels } from "../composables/usePossibleValues";

const props = defineProps<
  VueControlPropsForLabelContent<string[]> & {
    possibleValues: TypedIdAndText[] | null;
  }
>();

const { includedLabel, excludedLabel } = useIncludedExcludedLabels(
  toRef(props, "control"),
);

const kdsPossibleValues = computed<KdsTwinListPossibleValue[]>(() =>
  (props.possibleValues ?? []).map((v) => ({
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

const manuallyExcluded = computed(() => {
  const includedSet = new Set(props.control.data ?? []);
  return kdsPossibleValues.value
    .filter((v) => !includedSet.has(v.id))
    .map((v) => v.id);
});
</script>

<template>
  <KdsTwinList
    :id="labelForId"
    :ariaLabel="control.label"
    :disabled="disabled"
    :manually-included="control.data ?? []"
    :manually-excluded="manuallyExcluded"
    :possible-values="kdsPossibleValues"
    :loading="possibleValues === null"
    :exclude-label="excludedLabel"
    :include-label="includedLabel"
    @update:manually-included="changeValue"
  />
</template>
