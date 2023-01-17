<script>
import { defineComponent } from '@vue/composition-api';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue2';
import { optionsMapper, getFlowVariablesMap, isModelSettingAndHasNodeView, optionsMapperWithType }
    from '@/utils/nodeDialogUtils';
import Twinlist from '~/webapps-common/ui/components/forms/Twinlist.vue';
import LabeledInput from './LabeledInput.vue';
import DialogComponentWrapper from './DialogComponentWrapper.vue';

const defaultTwinlistSize = 7;
const defaultTwinlistLeftLabel = 'Excluded Values';
const defaultTwinlistRightLabel = 'Included Values';

const TwinlistInput = defineComponent({
    name: 'TwinListInput',
    components: {
        Twinlist,
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
        possibleValues() {
            return this.control.schema.properties.selected.anyOf.map(
                this.withTypes ? optionsMapperWithType : optionsMapper
            );
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
        onInverseSearchChange(isInverted) {
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
      <Twinlist
        v-if="possibleValues"
        :show-mode="showMode"
        :show-search="showSearch"
        :disabled="disabled"
        :value="control.data.selected"
        :with-types="withTypes"
        :initial-selected-types="control.data.typeFilter.selectedTypes"
        :initial-pattern="control.data.patternFilter.pattern"
        :initial-mode="control.data.mode.toLowerCase()"
        :initial-case-sensitive-search="control.data.patternFilter.isCaseSensitive"
        :initial-inverse-search="control.data.patternFilter.isInverted"
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
        @inverseSearchInput="onInverseSearchChange"
        @caseSensitiveSearchInput="onCaseSensitiveChange"
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
