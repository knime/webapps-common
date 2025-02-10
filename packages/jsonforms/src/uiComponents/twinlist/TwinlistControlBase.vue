<script setup lang="ts">
import { markRaw, toRef } from "vue";

import { Twinlist } from "@knime/components";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";
import type { IdAndText } from "../../types/ChoicesUiSchema";
import { useIncludedExcludedLabels } from "../composables/usePossibleValues";
import TwinlistLoadingInfo from "../loading/TwinlistLoadingInfo.vue";

const props = withDefaults(
  defineProps<
    VueControlPropsForLabelContent<string[]> & {
      twinlistSize?: number;
      possibleValues: IdAndText[] | null;
    }
  >(),
  {
    twinlistSize: 10,
  },
);

const TwinlistLoadingInfoRaw = markRaw(TwinlistLoadingInfo) as any;

const { includedLabel, excludedLabel } = useIncludedExcludedLabels(
  toRef(props, "control") as any,
);
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
    :left-label="excludedLabel"
    :right-label="includedLabel"
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
