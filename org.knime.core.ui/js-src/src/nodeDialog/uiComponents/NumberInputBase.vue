<script>
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from "../utils";
import NumberInput from "webapps-common/ui/components/forms/NumberInput.vue";
import LabeledInput from "./LabeledInput.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";

const NumberInputBase = defineComponent({
  name: "NumberInputBase",
  components: {
    NumberInput,
    LabeledInput,
    DialogComponentWrapper,
  },
  props: {
    ...rendererProps(),
    type: {
      type: String,
      required: false,
      default: "double",
    },
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
    min() {
      return this.control.schema.minimum;
    },
    max() {
      return this.control.schema.maximum;
    },
    disabled() {
      return (
        !this.control.enabled ||
        Boolean(this.flowSettings?.controllingFlowVariableName)
      );
    },
  },
  methods: {
    onChange(number) {
      this.handleChange(this.control.path, number);
      if (this.isModelSettingAndHasNodeView) {
        this.$store.dispatch("pagebuilder/dialog/dirtySettings", true);
      }
    },
    onFocusOut() {
      const number = this.control.data;
      if (this.isSmallerThanMin(number)) {
        this.onChange(this.min);
      } else if (this.isGreaterThanMax(number)) {
        this.onChange(this.max);
      }
    },
    isSmallerThanMin(number) {
      return typeof this.min === "number" && number < this.min;
    },
    isGreaterThanMax(number) {
      return typeof this.max === "number" && number > this.max;
    },
  },
});
export default NumberInputBase;
</script>

<template>
  <DialogComponentWrapper :control="control">
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
      <NumberInput
        :id="labelForId"
        class="number-input"
        :disabled="disabled"
        :model-value="control.data"
        :type="type"
        :min="control.schema.minimum"
        :max="control.schema.maximum"
        @update:model-value="onChange"
        @focusout="onFocusOut"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>
