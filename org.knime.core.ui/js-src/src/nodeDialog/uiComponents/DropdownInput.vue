<script>
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { getFlowVariablesMap, isModelSettingAndHasNodeView } from '../utils';
import Dropdown from 'webapps-common/ui/components/forms/Dropdown.vue';
import LabeledInput from './LabeledInput.vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import { generatePossibleColumnValues } from './ColumnSelect.vue';


const DropdownInput = defineComponent({
    name: 'DropdownInput',
    components: {
        Dropdown,
        LabeledInput,
        DialogComponentWrapper
    },
    props: {
        ...rendererProps(),
        optionsGenerator: {
            type: Function,
            required: false,
            default: (control) => generatePossibleColumnValues(control.schema.properties.selected.oneOf)
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
            return !this.control.enabled || this.flowSettings?.controllingFlowVariableAvailable ||
                this.options.length === 0;
        },
        placeholderText() {
            return this.options.length > 0 ? 'No value selected' : 'No values present';
        }
    },
    mounted() {
        this.options = this.optionsGenerator(this.control);
    },
    methods: {
        onChange(selectedValue) {
            this.handleChange(this.control.path, { selected: selectedValue });
            if (this.isModelSettingAndHasNodeView) {
                this.$store.dispatch('pagebuilder/dialog/dirtySettings', true);
            }
        }
    }
});
export default DropdownInput;
</script>

<template>
  <DialogComponentWrapper
    :control="control"
    style="min-width: 0;"
  >
    <LabeledInput
      :text="control.label"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :scope="control.uischema.scope"
      :flow-settings="flowSettings"
      :description="control.description"
    >
      <Dropdown
        v-if="options"
        :aria-label="control.label"
        :disabled="disabled"
        :model-value="control.data.selected"
        :possible-values="options"
        :placeholder="placeholderText"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>
