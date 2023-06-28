<script>
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { getFlowVariablesMap, getPossibleValuesFromUiSchema, isModelSettingAndHasNodeView } from '../utils';
import Dropdown from 'webapps-common/ui/components/forms/Dropdown.vue';
import LabeledInput from './LabeledInput.vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import { isDeepStrictEqual } from 'is-deep-strict-equal-x';
import { JsonDataService, AlertTypes } from '@knime/ui-extension-service';

const DropdownInput = defineComponent({
    name: 'DropdownInput',
    components: {
        Dropdown,
        LabeledInput,
        DialogComponentWrapper
    },
    inject: ['registerWatcher', 'getKnimeService'],
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
        return useJsonFormsControl(props);
    },
    data() {
        return {
            options: null,
            jsonDataService: null
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
            this.registerWatcher(this.updateOptions.bind(this), dependencies);
        }
        
        let options = this.optionsGenerator(this.control);
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
        async updateOptions(newSettings) {
            if (!this.jsonDataService) {
                this.jsonDataService = new JsonDataService(this.getKnimeService());
            }
            // TODO: UIEXT-1053: Hide this behind a (better) API
            const { result, state, message } = await this.jsonDataService.data({
                method: 'invokeActionHandler',
                options: [
                    this.choicesUpdateHandler,
                    null,
                    { ...newSettings.view, ...newSettings.model }
                ]
            });
            if (result) {
                this.handleResult(result);
            }
            if (state === 'FAIL') {
                const knimeService = this.getKnimeService();
                knimeService.sendWarning(knimeService.createAlert({
                    type: AlertTypes.ERROR,
                    message
                }));
                this.handleResult([]);
            }
        },
        handleResult(result) {
            this.options = result;
            this.onChange(result.length > 0 ? result[0].id : null);
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
