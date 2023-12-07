<script setup lang="ts">
import { type Ref, markRaw, ref } from "vue";
import { rendererProps } from "@jsonforms/vue";
import Twinlist from "webapps-common/ui/components/forms/Twinlist.vue";
import inject from "../utils/inject";
import TwinlistLoadingInfo from "./loading/TwinlistLoadingInfo.vue";
import type { IdAndText } from "../types/ChoicesUiSchema";
import useDialogControl from "../composables/useDialogControl";
import LabeledInput from "./label/LabeledInput.vue";

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

const {
  control,
  handleDirtyChange: onChange,
  disabled,
} = useDialogControl<string[]>({ props });
const getPossibleValuesFromUiSchema = inject("getPossibleValuesFromUiSchema");
const possibleValues: Ref<null | IdAndText[]> = ref(null);
const TwinlistLoadingInfoRaw = markRaw(TwinlistLoadingInfo) as any;

if (props.optionsGenerator === null) {
  getPossibleValuesFromUiSchema(control.value).then((result) => {
    possibleValues.value = result;
  });
} else {
  possibleValues.value = props.optionsGenerator(control.value);
}
</script>

<template>
  <LabeledInput
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
      :filter-chosen-values-on-possible-values-change="false"
      @update:model-value="onChange"
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
