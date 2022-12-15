<script>
import { defineComponent } from '@vue/composition-api';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue2';
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from '@/utils/nodeDialogUtils';
import InputField from '~/webapps-common/ui/components/forms/InputField.vue';
import LabeledInput from './LabeledInput.vue';
import advancedSettingsMixin from '../mixins/advancedSettingsMixin';

const TextInput = defineComponent({
    name: 'TextInput',
    components: {
        InputField,
        LabeledInput
    },
    mixins: [advancedSettingsMixin],
    props: {
        ...rendererProps()
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
export default TextInput;
</script>

<template>
  <LabeledInput
    v-if="isVisible"
    :text="control.label"
    :description="control.description"
    :errors="[control.errors]"
    :show-reexecution-icon="isModelSettingAndHasNodeView"
    :scope="control.uischema.scope"
    :flow-settings="flowSettings"
    :class="{fadeContainer: isAdvanced}"
  >
    <InputField
      :value="control.data"
      :disabled="disabled"
      @input="onChange"
    />
  </LabeledInput>
</template>

<style>
@import "../../utils/animation.css";
</style>
