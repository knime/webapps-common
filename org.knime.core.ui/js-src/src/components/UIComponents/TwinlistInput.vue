<script>
import { defineComponent } from '@vue/composition-api';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue2';
import { optionsMapper, getFlowVariablesMap, isModelSettingAndHasNodeView, optionsMapperWithType }
    from '@/utils/nodeDialogUtils';
import LabeledInput from './LabeledInput.vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import MultiModeTwinlist from '~/webapps-common/ui/components/forms/MultiModeTwinlist.vue';

const defaultTwinlistSize = 7;
const defaultTwinlistLeftLabel = 'Excluded Values';
const defaultTwinlistRightLabel = 'Included Values';

const TwinlistInput = defineComponent({
    name: 'TwinListInput',
    components: {
        MultiModeTwinlist,
        LabeledInput,
        DialogComponentWrapper
    },
    props: {
        ...rendererProps(),
        twinlistSize: {
            type: Number,
            required: false,
            default: defaultTwinlistSize
        },
        twinlistLeftLabel: {
            type: String,
            required: false,
            default: defaultTwinlistLeftLabel
        },
        twinlistRightLabel: {
            type: String,
            required: false,
            default: defaultTwinlistRightLabel
        }
    },
    setup(props) {
        return useJsonFormsControl(props);
    },
    data() {
        return {
            possibleValues: null
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
        },
        withTypes() {
            return this.control.schema.properties.selected.anyOf[0].hasOwnProperty('columnType');
        },
        showMode() {
            return !this.control.uischema.options?.hasOwnProperty('showMode') ||
                this.control.uischema.options?.showMode;
        },
        showPattern() {
            return !this.control.uischema.options?.hasOwnProperty('showPattern') ||
                this.control.uischema.options?.showPattern;
        }
    },
    created() {
        let possibleValues = this.control.schema.properties.selected.anyOf.map(
            this.withTypes ? optionsMapperWithType : optionsMapper
        );
        if (possibleValues.length === 1 && possibleValues[0].id === '') {
            possibleValues = [];
        }
        this.possibleValues = possibleValues;
    },
    methods: {
        onChange(obj, attr = '') {
            let newData = { ...this.control.data };
            if (attr === '') {
                newData = { ...newData, ...obj };
            } else {
                newData[attr] = { ...newData[attr], ...obj };
            }
            this.handleChange(this.control.path, newData);
        },
        onSelectedChange(selected, isManual) {
            this.onChange({ selected, ...isManual ? { manualFilter: { manuallySelected: selected } } : {} });
            if (this.isModelSettingAndHasNodeView) {
                this.$store.dispatch('pagebuilder/dialog/dirtySettings', true);
            }
        },
        onPatternChange(pattern) {
            this.onChange({ pattern }, 'patternFilter');
        },
        onModeChange(mode) {
            this.onChange({ mode: mode.toUpperCase() });
        },
        onSelectedTypesChange(selectedTypes) {
            this.onChange({ selectedTypes }, 'typeFilter');
        },
        onInversePatternChange(isInverted) {
            this.onChange({ isInverted }, 'patternFilter');
        },
        onCaseSensitiveChange(isCaseSensitive) {
            this.onChange({ isCaseSensitive }, 'patternFilter');
        }
    }
});
export default TwinlistInput;
</script>

<template>
  <DialogComponentWrapper :control="control">
    <LabeledInput
      v-if="control.visible"
      :text="control.label"
      :show-reexecution-icon="isModelSettingAndHasNodeView"
      :scope="control.uischema.scope"
      :flow-settings="flowSettings"
      :description="control.description"
    >
      <MultiModeTwinlist
        v-if="possibleValues"
        :show-mode="showMode"
        :show-pattern="showPattern"
        :disabled="disabled"
        :value="control.data.selected"
        :with-types="withTypes"
        :initial-selected-types="control.data.typeFilter.selectedTypes"
        :initial-pattern="control.data.patternFilter.pattern"
        :initial-mode="control.data.mode.toLowerCase()"
        :initial-case-sensitive-pattern="control.data.patternFilter.isCaseSensitive"
        :initial-inverse-pattern="control.data.patternFilter.isInverted"
        :initial-manually-selected="control.data.manualFilter.manuallySelected"
        :mode-label="'Selection mode'"
        :possible-values="possibleValues"
        :size="twinlistSize"
        :left-label="twinlistLeftLabel"
        :right-label="twinlistRightLabel"
        @input="onSelectedChange"
        @patternInput="onPatternChange"
        @modeInput="onModeChange"
        @typesInput="onSelectedTypesChange"
        @inversePatternInput="onInversePatternChange"
        @caseSensitivePatternInput="onCaseSensitiveChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.twinlist >>> .lists >>> .multiselect-list-box >>> [role="listbox"] {
  font-size: 13px;
}

.twinlist >>> .header >>> .title {
  font-size: 13px;
  font-weight: 500;
  color: var(--knime-dove-gray);
}

</style>
