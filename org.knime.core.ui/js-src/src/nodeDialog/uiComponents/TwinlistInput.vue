<script>
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { mergeDeep, getFlowVariablesMap, isModelSettingAndHasNodeView, getPossibleValuesFromUiSchema } from '../utils';
import LabeledInput from './LabeledInput.vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';
import MultiModeTwinlist from 'webapps-common/ui/components/forms/MultiModeTwinlist.vue';

const defaultTwinlistSize = 7;
const defaultTwinlistLeftLabel = 'Excludes';
const defaultTwinlistRightLabel = 'Includes';

const TwinlistInput = defineComponent({
    name: 'TwinListInput',
    components: {
        LabeledInput,
        DialogComponentWrapper,
        MultiModeTwinlist
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
            possibleValues: null,
            previouslySelectedTypes: null
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
            return this.possibleValues && this.possibleValues[0] && this.possibleValues[0].hasOwnProperty('type');
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
        this.possibleValues = getPossibleValuesFromUiSchema(this.control);
        this.updateManualFilter(this.possibleValues.map(col => col.id));

        this.previouslySelectedTypes = this.getPreviouslySelectedTypes();
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
        getPreviouslySelectedTypes() {
            const selectedTypesIds = this.control.data.typeFilter.selectedTypes;
            const selectedTypesToDisplayedText = this.typeDisplaysToMap(
                this.control.data.typeFilter.typeDisplays
            );
            return selectedTypesIds.map(id => ({
                id,
                text: selectedTypesToDisplayedText[id] || id
            }));
        },
        typeDisplaysToMap(keyValuePairs) {
            if (typeof keyValuePairs === 'undefined') {
                return {};
            }
            return keyValuePairs.reduce((obj, { id, text }) => ({ ...obj, [id]: text }), {});
        },
        onPatternChange(pattern) {
            this.onChange({ patternFilter: { pattern } });
        },
        onModeChange(mode) {
            this.onChange({ mode: mode.toUpperCase() });
        },
        onSelectedTypesChange(selectedTypes, typeDisplays) {
            this.onChange({ typeFilter: { selectedTypes, typeDisplays } });
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
        :with-types="withTypes"
        :initial-selected-types="control.data.typeFilter.selectedTypes"
        :additional-possible-types="previouslySelectedTypes"
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
        @include-unknown-values-input="onIncludeUnknownColumnsChange"
        @pattern-input="onPatternChange"
        @mode-input="onModeChange"
        @types-input="onSelectedTypesChange"
        @inverse-pattern-input="onInversePatternChange"
        @case-sensitive-pattern-input="onCaseSensitiveChange"
      />
    </LabeledInput>
  </DialogComponentWrapper>
</template>

<style lang="postcss" scoped>
.twinlist :deep(.lists) :deep(.multiselect-list-box) :deep([role="listbox"]) {
  font-size: 13px;
}

.twinlist :deep(.header) :deep(.title) {
  font-size: 13px;
  font-weight: 500;
  color: var(--knime-dove-gray);
}

</style>
