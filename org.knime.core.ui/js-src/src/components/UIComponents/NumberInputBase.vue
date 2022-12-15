<script>
import { defineComponent } from '@vue/composition-api';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue2';
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from '@/utils/nodeDialogUtils';
import NumberInput from '~/webapps-common/ui/components/forms/NumberInput.vue';
import LabeledInput from './LabeledInput.vue';
import advancedSettingsMixin from '../mixins/advancedSettingsMixin';

const NumberInputBase = defineComponent({
    name: 'NumberInputBase',
    components: {
        NumberInput,
        LabeledInput
    },
    mixins: [advancedSettingsMixin],
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
    <NumberInput
      class="number-input"
      :disabled="!control.enabled"
      :value="control.data"
      :type="type"
      :min="control.schema.minimum"
      :max="control.schema.maximum"
      @input="onChange"
    />
  </LabeledInput>
</template>

<style lang="postcss" scoped>
@import "../../utils/animation.css";
  .number-input {
    height: 40px;

    & >>> input[type="number"] {
      height: 38px;
    }
  }
</style>
