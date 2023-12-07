<script setup lang="ts">
import { type Ref, computed, onMounted, ref } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { optionsMapper } from "../utils";
import RadioButtons from "webapps-common/ui/components/forms/RadioButtons.vue";
import ValueSwitch from "webapps-common/ui/components/forms/ValueSwitch.vue";
import useDialogControl from "../composables/useDialogControl";
import { IdAndText } from "../types/ChoicesUiSchema";
import LabeledInput from "./label/LabeledInput.vue";

const props = defineProps({
  ...rendererProps(),
  type: {
    type: String,
    required: true,
    default: "radio",
  },
});

const {
  handleDirtyChange: onChange,
  control,
  disabled,
} = useDialogControl<string>({ props });

const alignment = computed(() => control.value.uischema.options?.radioLayout);
const uiComponent = computed(() => {
  switch (props.type) {
    case "valueSwitch":
      return ValueSwitch;
    case "radio":
      return RadioButtons;
    default:
      return RadioButtons;
  }
});

const options: Ref<IdAndText[] | null | undefined> = ref(null);
onMounted(() => {
  options.value = control.value?.schema?.oneOf?.map(optionsMapper);
});

const setControllingFlowVariable = (value: string) => {
  if (options.value?.filter(({ id }) => value === id).length) {
    onChange(value);
  }
};
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    :margin-bottom="10"
    @controlling-flow-variable-set="setControllingFlowVariable"
  >
    <component
      :is="uiComponent"
      v-if="options"
      :id="labelForId"
      :possible-values="options"
      :alignment="alignment"
      :disabled="disabled"
      :model-value="control.data"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>
