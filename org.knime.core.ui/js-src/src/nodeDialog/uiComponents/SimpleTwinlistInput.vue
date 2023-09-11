<script>
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import {
  getFlowVariablesMap,
  isModelSettingAndHasNodeView,
  getPossibleValuesFromUiSchema,
} from "../utils";
import Twinlist from "webapps-common/ui/components/forms/Twinlist.vue";
import LabeledInput from "./LabeledInput.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";

const defaultTwinlistSize = 7;
const defaultTwinlistLeftLabel = "Excludes";
const defaultTwinlistRightLabel = "Includes";

const SimpleTwinlistInput = defineComponent({
  name: "SimpleTwinListInput",
  components: {
    Twinlist,
    LabeledInput,
    DialogComponentWrapper,
  },
  props: {
    ...rendererProps(),
    twinlistSize: {
      type: Number,
      required: false,
      default: defaultTwinlistSize,
    },
    twinlistLeftLabel: {
      type: String,
      required: false,
      default: defaultTwinlistLeftLabel,
    },
    twinlistRightLabel: {
      type: String,
      required: false,
      default: defaultTwinlistRightLabel,
    },
    optionsGenerator: {
      type: Function,
      required: false,
      default: getPossibleValuesFromUiSchema,
    },
  },
  setup(props) {
    return useJsonFormsControlWithUpdate(props);
  },
  data() {
    return {
      possibleValues: null,
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
  created() {
    this.possibleValues = this.optionsGenerator(this.control);
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
export default SimpleTwinlistInput;
</script>

<template>
  <DialogComponentWrapper :control="control">
    <LabeledInput
      #default="{ labelForId }"
      :config-keys="control?.schema?.configKeys"
      :flow-variables-map="control.rootSchema.flowVariablesMap"
      :path="control.path"
      :text="control.label"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :flow-settings="flowSettings"
      :description="control.description"
      @controlling-flow-variable-set="onChange"
    >
      <Twinlist
        v-if="possibleValues"
        :id="labelForId"
        :disabled="disabled"
        :model-value="control.data"
        :possible-values="possibleValues"
        :size="twinlistSize"
        :left-label="twinlistLeftLabel"
        :right-label="twinlistRightLabel"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
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
