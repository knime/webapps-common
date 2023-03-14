<script>
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { generatePossibleValues, getFlowVariablesMap, isModelSettingAndHasNodeView } from '../utils';
import Dropdown from 'webapps-common/ui/components/forms/Dropdown.vue';
import LabeledInput from './LabeledInput.vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import { isDeepStrictEqual } from 'is-deep-strict-equal-x';

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
            default: (control) => generatePossibleValues(control.schema.oneOf)
        },
        controlDataToDropdownValue: {
            type: Function,
            required: false,
            default: (data) => data
        },
        dropdownValueToControlData: {
            type: Function,
            required: false,
            default: (control, value) => value
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
        },
        dropdownValue() {
            return this.controlDataToDropdownValue(this.control.data);
        }
    },
    mounted() {
        let options = this.optionsGenerator(this.control);
        // Since an oneOf cannot be empty, we currently add one option in the backend with empty id and title.
        // TODO: Remove this when the respective schema structure is adjusted with UIEXT-715
        if (options.length === 1 && options[0].id === '') {
            options = [];
        }
        this.options = options;
        this.updateInitialData();
    },
    methods: {
        updateInitialData() {
            const initialData = this.control.data;
            const updatedInitialData = this.dropdownValueToControlData(
                this.control,
                this.controlDataToDropdownValue(initialData)
            );
            if (!isDeepStrictEqual(initialData, updatedInitialData)) {
                this.handleChange(this.control.path, updatedInitialData);
            }
        },
        onChange(value) {
            this.handleChange(this.control.path, this.dropdownValueToControlData(this.control, value));
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
        :model-value="dropdownValue"
        :possible-values="options"
        :placeholder="placeholderText"
        @update:model-value="onChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>
