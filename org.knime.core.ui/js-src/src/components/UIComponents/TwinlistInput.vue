<script>
import { defineComponent } from '@vue/composition-api';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue2';
import { mergeDeep, optionsMapper, getFlowVariablesMap, isModelSettingAndHasNodeView, optionsMapperWithType }
    from '@/utils/nodeDialogUtils';
import LabeledInput from './LabeledInput.vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import MultiModeTwinlist from '~/webapps-common/ui/components/forms/MultiModeTwinlist.vue';

const defaultTwinlistSize = 7;
const defaultTwinlistLeftLabel = 'Excluded values';
const defaultTwinlistRightLabel = 'Included values';

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
        showSearch() {
            return !this.control.uischema.options?.hasOwnProperty('showSearch') ||
                this.control.uischema.options?.showSearch;
        }
    },
    created() {
        let possibleValues = this.control.schema.properties.selected.anyOf.map(
            this.withTypes ? optionsMapperWithType : optionsMapper
        );
        // Since an anyOf cannot be empty, we currently add one option in the backend with empty id and title.
        // TODO: Remove this when the respective schema structure is adjusted with UIEXT-715
        if (possibleValues.length === 1 && possibleValues[0].id === '') {
            possibleValues = [];
        }
        this.possibleValues = possibleValues;
        this.updateManualFilter(this.possibleValues.map(col => col.id));
    },
    methods: {
        onChange(obj) {
            let newData = mergeDeep(this.control.data, obj);
            this.handleChange(this.control.path, newData);
        },
        onSelectedChange({ selected, isManual, deselected }) {
            this.onChange({
                selected,
                ...isManual
                    ? { manualFilter: { manuallySelected: selected, manuallyDeselected: deselected } }
                    : {}
            });
            if (this.isModelSettingAndHasNodeView) {
                this.$store.dispatch('pagebuilder/dialog/dirtySettings', true);
            }
        },
        onIncludeUnknownColumnsChange(includeUnknownColumns) {
            this.onChange({ manualFilter: { includeUnknownColumns } });
        },
        /**
         *  add unknown columns either to the manually selected or manually deselected
         * @param {string[]} possibleValueIds the possible values from which unknown values are determined.
         * @returns {void}.
         */
        updateManualFilter(possibleValueIds) {
            const { manuallySelected, manuallyDeselected, includeUnknownColumns } = this.control.data.manualFilter;
            const unknownColumns = possibleValueIds.filter(
                col => !manuallySelected.includes(col) && !manuallyDeselected.includes(col)
            );
            const remainingManuallyDeselected = manuallyDeselected.filter(col => possibleValueIds.includes(col));
            const newData = {};
            if (includeUnknownColumns) {
                newData.manualFilter = {
                    manuallySelected: [...manuallySelected, ...unknownColumns],
                    manuallyDeselected: remainingManuallyDeselected
                };
            } else {
                newData.manualFilter = {
                    manuallyDeselected: [...remainingManuallyDeselected, ...unknownColumns]
                };
            }
            this.onChange(newData);
        },
        onPatternChange(pattern) {
            this.onChange({ patternFilter: { pattern } });
        },
        onModeChange(mode) {
            this.onChange({ mode: mode.toUpperCase() });
        },
        onSelectedTypesChange(selectedTypes) {
            this.onChange({ typeFilter: { selectedTypes } });
        },
        onInversePatternChange(isInverted) {
            this.onChange({ patternFilter: { isInverted } });
        },
        onCaseSensitiveChange(isCaseSensitive) {
            this.onChange({ patternFilter: { isCaseSensitive } });
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
        v-bind="$attrs"
        :show-mode="showMode"
        :show-search="showSearch"
        :disabled="disabled"
        :value="control.data.selected"
        :with-types="withTypes"
        :initial-selected-types="control.data.typeFilter.selectedTypes"
        :initial-pattern="control.data.patternFilter.pattern"
        :initial-mode="control.data.mode.toLowerCase()"
        :initial-case-sensitive-pattern="control.data.patternFilter.isCaseSensitive"
        :initial-inverse-pattern="control.data.patternFilter.isInverted"
        :initial-manually-selected="control.data.manualFilter.manuallySelected"
        :initial-include-unknown-values="control.data.manualFilter.includeUnknownColumns"
        mode-label="Selection mode"
        :possible-values="possibleValues"
        :size="twinlistSize"
        :left-label="twinlistLeftLabel"
        :right-label="twinlistRightLabel"
        @input="onSelectedChange"
        @includeUnknownValuesInput="onIncludeUnknownColumnsChange"
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
