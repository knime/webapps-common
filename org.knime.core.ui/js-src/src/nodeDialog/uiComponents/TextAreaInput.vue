<script>
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from "../utils";
import TextArea from "webapps-common/ui/components/forms/TextArea.vue";
import LabeledInput from "./LabeledInput.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";

const TextAreaInput = defineComponent({
  name: "TextAreaInput",
  components: {
    TextArea,
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
      return this.control.schema.placeholder ?? "";
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
export default TextAreaInput;
</script>

<template>
  <DialogComponentWrapper :control="control" style="min-width: 0">
    <LabeledInput
      #default="{ labelForId }"
      :config-keys="control?.schema?.configKeys"
      :with-flow-variables="false"
      :path="control.path"
      :text="control.label"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :description="control.description"
      :errors="[control.errors]"
      @controlling-flow-variable-set="onChange"
    >
      <TextArea
        :id="labelForId"
        class="text-area-input"
        :model-value="control.data"
        :disabled="disabled"
        :rows="control.uischema.options?.rows"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.text-area-input {
  max-width: 100%;

  & :deep(textarea) {
    resize: vertical;
    width: 100%;
    min-height: 40px;
    padding: 10px;
  }
}
</style>
