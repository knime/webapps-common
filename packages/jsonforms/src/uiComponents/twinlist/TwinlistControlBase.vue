<script setup lang="ts">
import { computed, markRaw, toRef } from "vue";

import { Twinlist } from "@knime/components";
import { KdsDataType } from "@knime/kds-components";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";
import type { TypedIdAndText } from "../../types/ChoicesUiSchema";
import { useIncludedExcludedLabels } from "../composables/usePossibleValues";
import TwinlistLoadingInfo from "../loading/TwinlistLoadingInfo.vue";

const props = withDefaults(
  defineProps<
    VueControlPropsForLabelContent<string[]> & {
      twinlistSize?: number;
      possibleValues: TypedIdAndText[] | null;
    }
  >(),
  {
    twinlistSize: 10,
  },
);

const TwinlistLoadingInfoRaw = markRaw(TwinlistLoadingInfo);

const { includedLabel, excludedLabel } = useIncludedExcludedLabels(
  toRef(props, "control"),
);

const withTypes = computed(() => props.possibleValues?.some((v) => v.type));
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
  >
    <template v-if="withTypes" #option="{ slotItem }">
      <div :class="['data-type-entry', { invalid: slotItem.invalid }]">
        <KdsDataType
          :icon-name="slotItem?.type?.id"
          :icon-title="slotItem?.type?.text"
          size="small"
        />
        <span>{{ slotItem.text }}</span>
      </div>
    </template>
  </Twinlist>
</template>

<style scoped>
.data-type-entry {
  display: flex;
  gap: var(--space-4);
  align-items: center;

  & > span {
    overflow: hidden;
    text-overflow: ellipsis;
  }
}

.twinlist :deep(.lists .multiselect-list-box [role="listbox"]) {
  font-size: 13px;
}

.twinlist :deep(.header .title) {
  font-size: 13px;
  font-weight: 500;
  color: var(--knime-dove-gray);
}
</style>
