<script>
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from "../../utils";
import FileChooserInput from "./FileChooserInput.vue";
import LabeledInput from "../LabeledInput.vue";
import DialogComponentWrapper from "../DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "../../composables/useJsonFormsControlWithUpdate";

const LabeledFileChooserInput = defineComponent({
  name: "LabeledFileChooserInput",
  components: {
    FileChooserInput,
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
    isModelSettingAndHasNodeView() {
      return isModelSettingAndHasNodeView(this.control);
    },
    flowSettings() {
      return getFlowVariablesMap(this.control);
    },
    data() {
      return (
        this.control.data ?? { path: "", timeout: 1000, fsCategory: "LOCAL" }
      );
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
export default LabeledFileChooserInput;
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
      <FileChooserInput
        :id="labelForId"
        :disabled="disabled"
        :model-value="data"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>
