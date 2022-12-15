<script>
import { defineComponent } from '@vue/composition-api';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue2';
import { optionsMapper, getFlowVariablesMap, isModelSettingAndHasNodeView } from '@/utils/nodeDialogUtils';
import Dropdown from '~/webapps-common/ui/components/forms/Dropdown.vue';
import LabeledInput from './LabeledInput.vue';
import advancedSettingsMixin from '../mixins/advancedSettingsMixin';

const DropdownInput = defineComponent({
    name: 'DropdownInput',
    components: {
        Dropdown,
        LabeledInput
    },
    mixins: [advancedSettingsMixin],
    props: {
        ...rendererProps(),
        optionsGenerator: {
            type: Function,
            required: false,
            default: (control) => control.schema.oneOf.map(optionsMapper)
        }
    },
    setup(props) {
        return useJsonFormsControl(props);
    },
    data() {
        return {
            options: null
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
            return !this.control.enabled || this.flowSettings?.controllingFlowVariableAvailable;
        }
    },
    mounted() {
        this.options = this.optionsGenerator(this.control);
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
export default DropdownInput;
</script>

<template>
  <LabeledInput
    v-if="isVisible"
    :text="control.label"
    :show-reexecution-icon="isModelSettingAndHasNodeView"
    :scope="control.uischema.scope"
    :flow-settings="flowSettings"
    :description="control.description"
    :class="{fadeContainer: isAdvanced}"
  >
    <Dropdown
      v-if="options"
      :aria-label="control.label"
      :disabled="!control.enabled"
      :value="control.data"
      :possible-values="options"
      @input="onChange"
    />
  </LabeledInput>
</template>

<style lang="postcss" scoped>
@import "../../utils/animation.css";
</style>
