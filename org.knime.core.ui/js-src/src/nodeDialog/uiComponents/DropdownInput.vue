<script>
import { defineComponent } from 'vue';
import { rendererProps } from '@jsonforms/vue';
import { getFlowVariablesMap, getPossibleValuesFromUiSchema, isModelSettingAndHasNodeView } from '../utils';
import Dropdown from 'webapps-common/ui/components/forms/Dropdown.vue';
import LabeledInput from './LabeledInput.vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import { AlertTypes } from '@knime/ui-extension-service';
import { set, isEqual } from 'lodash';
import { useJsonFormsControlWithUpdate } from './composables/jsonFormsControlWithUpdate';
import getFlattenedSettings from '../utils/getFlattenedSettings';
import { v4 as uuidv4 } from 'uuid';

const DropdownInput = defineComponent({
    name: 'DropdownInput',
    components: {
        Dropdown,
        LabeledInput,
        DialogComponentWrapper
    },
    inject: ['registerWatcher', 'getKnimeService', 'getData', 'sendAlert'],
    props: {
        ...rendererProps(),
        optionsGenerator: {
            type: Function,
            required: false,
            default: getPossibleValuesFromUiSchema
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
        return useJsonFormsControlWithUpdate(props);
    },
    data() {
        return {
            options: [],
            widgetId: uuidv4()
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
        },
        choicesUpdateHandler() {
            return this.control.uischema.options?.choicesUpdateHandler;
        }
    },
    mounted() {
        if (this.choicesUpdateHandler) {
            const dependencies = this.control.uischema.options?.dependencies || [];
            this.registerWatcher({
                transformSettings: this.updateOptions.bind(this),
                init: this.fetchInitialOptions.bind(this),
                dependencies
            });
        } else {
            this.setInitialOption();
        }
        this.updateInitialData();
    },
    methods: {
        setInitialOption() {
            let options = this.optionsGenerator(this.control);
            this.options = options;
        },
        async fetchInitialOptions(newSettings) {
            // initially only fetch possible values, but do not set a value
            // instead, use value from initial data
            await this.updateOptions(newSettings, false);
        },
        updateInitialData() {
            const initialData = this.control.data;
            const updatedInitialData = this.dropdownValueToControlData(
                this.control,
                this.controlDataToDropdownValue(initialData)
            );
            if (!isEqual(initialData, updatedInitialData)) {
                this.handleChange(this.control.path, updatedInitialData);
            }
        },
        async updateOptions(newSettings, setNewValue = true) {
            const { result, state, message } = await this.getData({
                method: 'update',
                options: [
                    this.widgetId,
                    this.choicesUpdateHandler,
                    getFlattenedSettings(newSettings)
                ]
            });
            if (result) {
                this.handleResult(result, newSettings, setNewValue);
            }
            if (state === 'FAIL') {
                this.sendAlert({
                    type: AlertTypes.ERROR,
                    message
                });
                this.handleResult([], newSettings, setNewValue);
            }
        },
        handleResult(result, newSettings, setNewValue = true) {
            this.options = result;
            if (setNewValue) {
                set(newSettings, this.control.path, this.getFirstValueFromDropdownOrNull(result));
            }
        },
        getFirstValueFromDropdownOrNull(result) {
            return this.dropdownValueToControlData(this.control, result.length > 0 ? result[0].id : null);
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
