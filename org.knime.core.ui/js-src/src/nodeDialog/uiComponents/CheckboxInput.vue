<script>
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from "../utils";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";
import ReexecutionIcon from "webapps-common/ui/assets/img/icons/reexecution.svg";
import FlowVariableButton from "./flowVariables/FlowVariableButton.vue";
import ErrorMessage from "./ErrorMessage.vue";
import DescriptionPopover from "./description/DescriptionPopover.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";

const CheckboxInput = defineComponent({
  name: "CheckboxInput",
  components: {
    Checkbox,
    ErrorMessage,
    FlowVariableButton,
    DescriptionPopover,
    ReexecutionIcon,
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
      hover: false,
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
export default CheckboxInput;
</script>

<template>
  <DialogComponentWrapper :control="control">
    <div
      class="checkbox-input"
      @mouseover="hover = true"
      @mouseleave="hover = false"
    >
      <Checkbox
        class="checkbox"
        :disabled="disabled"
        :model-value="control.data"
        @update:model-value="onChange"
      >
        {{ control.label }}
        <ReexecutionIcon
          v-if="isModelSettingAndHasNodeView"
          class="reexecution-icon"
        />
      </Checkbox>
      <FlowVariableButton
        :flow-settings="flowSettings"
        :flow-variables-map="control.rootSchema.flowVariablesMap"
        :path="control.path"
        :hover="hover"
        :config-keys="control.schema.configKeys"
        @controlling-flow-variable-set="onChange"
      />
      <DescriptionPopover
        v-if="control.description"
        :html="control.description"
        :hover="hover"
      />
      <ErrorMessage :error="control.errors" />
    </div>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.checkbox-input {
  margin-bottom: 10px;
  position: relative;
  display: flex;

  & .checkbox {
    flex: 1;
    width: calc(100% - var(--description-button-size) - 3px);
    position: relative;
  }
}

.reexecution-icon {
  display: inline-block;
  vertical-align: top;
  height: 10px;
  margin: 3px 0 1px 5px;
}
</style>
