<script>
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from '../utils';
import NumberInput from 'webapps-common/ui/components/forms/NumberInput.vue';
import LabeledInput from './LabeledInput.vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';

const NumberInputBase = defineComponent({
    name: 'NumberInputBase',
    components: {
        NumberInput,
        LabeledInput,
        DialogComponentWrapper
    },
    props: {
        ...rendererProps(),
        type: {
            type: String,
            required: false,
            default: 'double'
        }
    },
    setup(props) {
        return useJsonFormsControl(props);
    },
    computed: {
        isModelSettingAndHasNodeView() {
            return isModelSettingAndHasNodeView(this.control);
        },
        flowSettings() {
            return getFlowVariablesMap(this.control);
        },
        disabled() {
            return !this.control.enabled || this.flowSettings?.controllingFlowVariableAvailable;
        }
    },
    methods: {
        onChange(event) {
            this.handleChange(this.control.path, event);
            if (this.isModelSettingAndHasNodeView) {
                this.$store.dispatch('pagebuilder/dialog/dirtySettings', true);
            }
        }
    }
});
export default NumberInputBase;
</script>

<template>
  <DialogComponentWrapper :control="control">
    <LabeledInput
      :text="control.label"
      :description="control.description"
      :errors="[control.errors]"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :scope="control.uischema.scope"
      :flow-settings="flowSettings"
    >
      <NumberInput
        class="number-input"
        :disabled="disabled"
        :model-value="control.data"
        :type="type"
        :min="control.schema.minimum"
        :max="control.schema.maximum"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.number-input {
  height: 40px;

  & :deep(input[type="number"]) {
    height: 38px;
  }
}
</style>
