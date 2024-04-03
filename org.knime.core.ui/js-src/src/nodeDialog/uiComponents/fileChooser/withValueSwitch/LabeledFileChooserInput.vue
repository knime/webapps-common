<script setup lang="ts">
import { computed, watch } from "vue";
import FileChooserInput from "./FileChooserInput.vue";
import useDialogControl from "@/nodeDialog/composables/components/useDialogControl";
import LabeledInput from "@/nodeDialog/uiComponents/label/LabeledInput.vue";
import { rendererProps } from "@jsonforms/vue";
import { FileChooserOptions } from "@/nodeDialog/types/FileChooserUiSchema";
const props = defineProps(rendererProps());
const {
  control,
  onChange: onChangeControl,
  disabled,
  flowSettings,
} = useDialogControl({
  subConfigKeys: ["path"],
  props,
});

const getDefaultData = () => {
  return {
    path: "",
    timeout: 10000,
    fsCategory: "LOCAL",
  };
};

const data = computed(() => {
  return control.value.data?.path ?? getDefaultData();
});

const onChange = (value: any) => {
  onChangeControl({ path: value });
};

const options = computed(() => {
  return control.value.uischema.options as FileChooserOptions;
});

watch(
  () => Boolean(flowSettings.value?.controllingFlowVariableName),
  (value) => {
    if (!value) {
      onChange(getDefaultData());
    }
  },
);
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <FileChooserInput
      :id="labelForId"
      :disabled="disabled"
      :model-value="data"
      :options="options"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>
