<script>
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import {
  optionsMapper,
  getFlowVariablesMap,
  isModelSettingAndHasNodeView,
} from "../utils";
import Checkboxes from "webapps-common/ui/components/forms/Checkboxes.vue";
import LabeledInput from "./LabeledInput.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";

const CheckboxesInput = defineComponent({
  name: "CheckboxesInput",
  components: {
    Checkboxes,
    LabeledInput,
    DialogComponentWrapper,
  },
  props: {
    ...rendererProps(),
  },
  setup(props) {
    return useJsonFormsControlWithUpdate(props);
  },
  data() {
    return {
      options: null,
    };
  },
  computed: {
    isModelSettingAndHasNodeView() {
      return isModelSettingAndHasNodeView(this.control);
    },
    flowSettings() {
      return getFlowVariablesMap(this.control);
    },
    disabled() {
      return (
        !this.control.enabled ||
        this.flowSettings?.controllingFlowVariableAvailable
      );
    },
    alignment() {
      return this.control.uischema.options?.checkboxLayout;
    },
  },
  mounted() {
    this.options = this.control.schema.anyOf?.map(optionsMapper);
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
export default CheckboxesInput;
</script>

<template>
  <DialogComponentWrapper :control="control">
    <LabeledInput
      :text="control.label"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :scope="control.uischema.scope"
      :flow-settings="flowSettings"
      :description="control.description"
    >
      <Checkboxes
        v-if="options"
        :possible-values="options"
        :alignment="alignment"
        :disabled="disabled"
        :model-value="control.data"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.labeled-input {
  margin-bottom: 10px;
}
</style>
