<script>
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from "../../utils";
import LocalFileChooserInput from "./LocalFileChooserInput.vue";
import LabeledInput from "../LabeledInput.vue";
import DialogComponentWrapper from "../DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "../../composables/useJsonFormsControlWithUpdate";

const LabeledLocalFileChooserInput = defineComponent({
  name: "LabeledLocalFileChooserInput",
  components: {
    LocalFileChooserInput,
    LabeledInput,
    DialogComponentWrapper,
  },
  props: {
    ...rendererProps(),
  },
  setup(props) {
    return useJsonFormsControlWithUpdate(props);
  },
  computed: {
    placeholder() {
      return this.control.uischema.options?.placeholder ?? "";
    },
    isModelSettingAndHasNodeView() {
      return isModelSettingAndHasNodeView(this.control);
    },
    flowSettings() {
      return getFlowVariablesMap(this.control);
    },
    disabled() {
      return (
        !this.control.enabled ||
        Boolean(this.flowSettings?.controllingFlowVariableName)
      );
    },
  },
  methods: {
    onChange(event) {
      this.handleChange(this.control.path, event);
      if (this.isModelSettingAndHasNodeView) {
        this.$store.dispatch("pagebuilder/dialog/dirtySettings", true);
      }
    },
  },
});
export default LabeledLocalFileChooserInput;
</script>

<template>
  <DialogComponentWrapper :control="control" style="min-width: 0">
    <LabeledInput
      #default="{ labelForId }"
      :config-keys="control?.schema?.configKeys"
      :flow-variables-map="control.rootSchema.flowVariablesMap"
      :path="control.path"
      :text="control.label"
      :description="control.description"
      :errors="[control.errors]"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :flow-settings="flowSettings"
      @controlling-flow-variable-set="onChange"
    >
      <LocalFileChooserInput
        :id="labelForId"
        :disabled="disabled"
        :placeholder="placeholder"
        :model-value="control.data"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>
