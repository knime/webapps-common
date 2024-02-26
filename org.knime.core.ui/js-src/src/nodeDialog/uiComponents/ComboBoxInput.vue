<script lang="ts">
import { defineComponent, type ComponentOptions } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { getFlowVariablesMap, isModelSettingAndHasNodeView } from "../utils";
import ComboBox from "webapps-common/ui/components/forms/ComboBox.vue";
import LabeledInput from "./LabeledInput.vue";
import DialogComponentWrapper from "./DialogComponentWrapper.vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";
import type { PossibleValue } from "../types/ChoicesUiSchema";

const ComboBoxInput = defineComponent({
  name: "ComboBoxInput",
  components: {
    ComboBox,
    LabeledInput,
    DialogComponentWrapper,
  } as ComponentOptions,
  props: {
    ...rendererProps(),
  },
  setup(props) {
    // @ts-ignore
    return useJsonFormsControlWithUpdate(props);
  },
  data(): {
    options: PossibleValue[] | undefined;
    selectedIds: string[];
    loaded: boolean;
  } {
    return {
      options: [],
      selectedIds: [],
      loaded: false,
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
        Boolean(this.flowSettings?.controllingFlowVariableName) ||
        typeof this.options === "undefined" ||
        this.options.length === 0
      );
    },
    noPossibleValuesPresent() {
      return typeof this.options === "undefined";
    },
  },
  mounted() {
    this.selectedIds = this.control.data;
    this.options = this.control.uischema?.options?.possibleValues;
    this.loaded = true;
  },
  methods: {
    onChange(value: string[]) {
      this.handleChange(this.control.path, value);
      if (this.isModelSettingAndHasNodeView) {
        // @ts-ignore
        this.$store.dispatch("pagebuilder/dialog/dirtySettings", true);
      }
    },
  },
});
export default ComboBoxInput;
</script>

<template>
  <DialogComponentWrapper :control="control" style="min-width: 0">
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
      <!--
        TODO Enable unsing :allow-new-values="noPossibleValuesPresent"
        (see https://github.com/vuejs/vue/issues/2169)
      -->
      <ComboBox
        v-if="loaded"
        :id="labelForId"
        :allow-new-values="noPossibleValuesPresent ? '' : false"
        :aria-label="control.label"
        :disabled="disabled"
        :possible-values="noPossibleValuesPresent ? [] : options"
        :model-value="selectedIds"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style scoped>
:deep(.multiselect) {
  background-color: white;
}
</style>
