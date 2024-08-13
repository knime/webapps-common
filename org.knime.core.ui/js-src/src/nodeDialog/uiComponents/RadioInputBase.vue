<script setup lang="ts">
import { type Ref, computed, onMounted, ref } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { optionsMapper } from "../utils";
import { RadioButtons, ValueSwitch } from "@knime/components";
import useDialogControl from "../composables/components/useDialogControl";
import { IdAndText } from "../types/ChoicesUiSchema";
import LabeledInput from "./label/LabeledInput.vue";

const marginBottomValueSwitch = 0;
const marginBottomRadioButtons = -10;

const props = defineProps({
  ...rendererProps(),
  type: {
    type: String,
    required: true,
    default: "radio",
  },
});

const { onChange, control, disabled } = useDialogControl<string>({ props });

type PossiblyDisabledOption = IdAndText & { disabled?: true };

const alignment = computed(() => control.value.uischema.options?.radioLayout);
const disabledOptions = computed<string[]>(
  () => control.value.uischema.options?.disabledOptions ?? [],
);
const disableOption = (option: IdAndText): PossiblyDisabledOption =>
  disabledOptions.value.includes(option.id)
    ? { ...option, disabled: true }
    : option;

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

const options: Ref<PossiblyDisabledOption[] | null | undefined> = ref(null);
onMounted(() => {
  options.value = control.value?.schema?.oneOf
    ?.map(optionsMapper)
    .map(disableOption);
});

const setControllingFlowVariable = (value: string) => {
  if (options.value?.filter(({ id }) => value === id).length) {
    onChange(value);
  }
};

const marginBottom = computed(() =>
  props.type === "valueSwitch"
    ? marginBottomValueSwitch
    : marginBottomRadioButtons,
);
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    :margin-bottom="marginBottom"
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
      compact
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>
