<script setup lang="ts">
import { computed, markRaw } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { Twinlist } from "@knime/components";
import inject from "@/nodeDialog/utils/inject";
import TwinlistLoadingInfo from "../loading/TwinlistLoadingInfo.vue";
import type { IdAndText } from "@/nodeDialog/types/ChoicesUiSchema";
import useDialogControl from "@/nodeDialog/composables/components/useDialogControl";
import LabeledControl from "../label/LabeledControl.vue";
import useProvidedState from "@/nodeDialog/composables/components/useProvidedState";

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
  optionsGenerator: {
    type: Function,
    required: false,
    default: null,
  },
});

const { control, onChange, disabled } = useDialogControl<string[]>({ props });
const getPossibleValuesFromUiSchema = inject("getPossibleValuesFromUiSchema");
const choicesProvider = computed(
  () => control.value.uischema.options?.choicesProvider,
);
const possibleValues = useProvidedState<null | IdAndText[]>(
  choicesProvider,
  null,
);
const TwinlistLoadingInfoRaw = markRaw(TwinlistLoadingInfo) as any;

if (!choicesProvider.value) {
  if (props.optionsGenerator === null) {
    getPossibleValuesFromUiSchema(control.value).then((result) => {
      possibleValues.value = result;
    });
  } else {
    possibleValues.value = props.optionsGenerator(control.value);
  }
}
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
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
      compact
      :filter-chosen-values-on-possible-values-change="false"
      @update:model-value="onChange"
    />
  </LabeledControl>
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
