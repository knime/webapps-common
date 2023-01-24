<script>
import Label from './Label.vue';
import SearchInput from './SearchInput.vue';
import Checkboxes from './Checkboxes.vue';
import ValueSwitch from './ValueSwitch.vue';
import Twinlist from './Twinlist.vue';
import { filters } from '../../../util/filters';

const allModes = { manual: 'Manual', wildcard: 'Wildcard', regex: 'Regex', type: 'Type' };

export default {
    components: {
        Label,
        SearchInput,
        Checkboxes,
        ValueSwitch,
        Twinlist
    },
    props: {

        /**
         * initial values
         */
        initialMode: {
            type: String,
            required: false,
            default: 'manual'
        },
        initialManuallySelected: {
            type: Array,
            default: () => []
        },
        initialIncludeUnknownValues: {
            type: Boolean,
            default: true
        },
        initialPattern: {
            type: String,
            default: ''
        },
        initialCaseSensitivePattern: {
            default: false,
            type: Boolean
        },
        initialInversePattern: {
            default: false,
            type: Boolean
        },
        withTypes: {
            type: Boolean,
            default: true
        },
        initialSelectedTypes: {
            type: Array,
            default: () => []
        },
        
        /**
         * Hiding and disabling
         */
        showMode: {
            default: false,
            type: Boolean
        },
        showUnknownValues: {
            default: true,
            type: Boolean
        },
        // enable search in case of manual selection
        showSearch: {
            default: true,
            type: Boolean
        },
        disabled: {
            default: false,
            type: Boolean
        },
        
        /**
         * Labels
         */

        modeLabel: {
            type: String,
            required: false,
            default: 'Selection mode'
        },
        patternLabel: {
            type: String,
            required: false,
            default: 'Pattern'
        },
        selectedTypesLabel: {
            type: String,
            required: false,
            default: 'Selected types'
        },
        /**
         * List of possible values. Each item must have an `id` and a `text` property
         * @example
         * [{
         *   id: 'pdf',
         *   text: 'PDF'
         * }, {
         *   id: 'XLS',
         *   text: 'Excel',
         * }]
         */
        possibleValues: {
            type: Array,
            default: () => [],
            validator(values) {
                if (!Array.isArray(values)) {
                    return false;
                }
                return values.every(item => item.hasOwnProperty('id') && item.hasOwnProperty('text'));
            }
        }
    },
    data() {
        return {
            chosenValues: this.initialManuallySelected,
            chosenPattern: this.initialPattern,
            chosenTypes: this.initialSelectedTypes,
            invalidPossibleValueIds: new Set(),
            rightSelected: [],
            selectedLeft: [],
            mode: this.initialMode,
            caseSensitivePattern: this.initialCaseSensitivePattern,
            inversePattern: this.initialInversePattern,
            includeUnknownValues: this.initialIncludeUnknownValues
        };
    },
    computed: {
        possibleValueMap() {
            // convert [{id: "key1", text: "asdf"}, ...] to {"key1": {id:"key1", text: "asdf"} ... }
            return Object.assign({}, ...this.possibleValues.map(obj => ({ [obj.id]: obj })));
        },
        possibleValueIds() {
            return this.possibleValues.map(x => x.id);
        },
        possibleTypes() {
            return [...new Set(this.possibleValues.map(x => x.type))]
                .filter(type => type !== '')
                .map(type => ({ text: type, id: type }));
        },
        matchingValueIds() {
            return this.possibleValues
                .filter(possibleValue => this.itemMatches(possibleValue))
                .map(possibleValue => possibleValue.id);
        },
        selectedValues() {
            return this.mode === 'manual' ? this.chosenValues : this.matchingValueIds;
        },
        deselectedValues() {
            return this.possibleValueIds.filter(id => !this.selectedValues.includes(id));
        },
        selectionDisabled() {
            return this.disabled || this.mode !== 'manual';
        },
        normalizedSearchTerm() {
            if (this.mode === 'manual') {
                return null;
            }
            return filters[this.mode].normalize(
                this.mode === 'type' ? this.chosenTypes : this.chosenPattern, this.caseSensitivePattern
            );
        },
        possibleModes() {
            let modes = Object.entries(allModes).map(([id, text]) => ({ id, text }));
            if (!this.withTypes) {
                modes = modes.filter(mode => mode.id !== 'type');
            }
            return modes;
        },
        possibleModeIds() {
            return this.possibleModes.map(mode => mode.id);
        },
        unknownValuesVisible() {
            return this.showUnknownValues && this.mode === 'manual';
        }
    },
    watch: {
        selectedValues: {
            immediate: true,
            handler(newVal, oldVal) {
                if (!oldVal || newVal.length !== oldVal.length || oldVal.some((item, i) => item !== newVal[i])) {
                    const isManual = this.mode === 'manual';
                    const event = { selected: this.selectedValues, isManual };
                    if (isManual) {
                        event.deselected = this.deselectedValues;
                    }
                    this.$emit('input', event);
                }
            }
        },
        includeUnknownValues(newVal) {
            this.$emit('includeUnknownValuesInput', newVal);
        }
    },
    methods: {
        onManualInput(value) {
            if (this.mode === 'manual') {
                this.chosenValues = value;
            }
        },
        onPatternInput(value) {
            this.chosenPattern = value;
            this.$emit('patternInput', value);
        },
        onTypeInput(value) {
            this.chosenTypes = value;
            this.$emit('typesInput', value);
        },
        onModeChange(value) {
            if (this.possibleModeIds.indexOf(value) !== -1) {
                this.mode = value;
                this.$emit('modeInput', value);
            }
        },
        onToggleCaseSensitivePattern(value) {
            this.caseSensitivePattern = value;
            this.$emit('caseSensitivePatternInput', value);
        },
        onToggleInvsersePattern(value) {
            this.inversePattern = value;
            this.$emit('inversePatternInput', value);
        },
        onUnkownColumnsInput(value) {
            if (this.mode === 'manual') {
                this.includeUnknownValues = value;
            }
        },
        validate() {
            return this.$refs.twinlist.validate();
        },
        hasSelection() {
            return this.selectedValues.length > 0;
        },
        itemMatches(item) {
            const mode = filters[this.mode];
            return mode.test(item[this.mode === 'type' ? 'type' : 'text'], this.normalizedSearchTerm,
                this.caseSensitivePattern, this.inversePattern);
        }
    }
};
</script>

<template>
  <div
    class="multi-mode-twinlist"
    :class="{disabled}"
  >
    <Label
      v-if="showMode"
      v-slot="{ labelForId }"
      :text="modeLabel"
      class="label"
      compact
    >
      <ValueSwitch
        :id="labelForId"
        ref="mode"
        :value="mode"
        :disabled="disabled"
        :possible-values="possibleModes"
        @input="onModeChange"
      />
    </Label>
    <Label
      v-if=" mode === 'regex' || mode === 'wildcard'"
      v-slot="{ labelForId }"
      :text="patternLabel"
      class="label"
      compact
    >
      <SearchInput
        :id="labelForId"
        ref="search"
        :value="chosenPattern"
        :label="patternLabel"
        :initial-case-sensitive-search="initialCaseSensitivePattern"
        :initial-inverse-search="initialInversePattern"
        show-case-sensitive-search-button
        show-inverse-search-button
        :disabled="disabled"
        @input="onPatternInput"
        @toggle-case-sensitive-search="onToggleCaseSensitivePattern"
        @toggle-inverse-search="onToggleInvsersePattern"
      />
    </Label>
    <Label
      v-if="mode === 'type' && possibleTypes.length > 0"
      :text="selectedTypesLabel"
      class="label"
      compact
    >
      <Checkboxes
        :value="chosenTypes"
        :possible-values="possibleTypes"
        :disabled="disabled"
        @input="onTypeInput"
      />
    </Label>
    <Twinlist
      ref="twinlist"
      :disabled="selectionDisabled"
      :show-search="mode === 'manual' && showSearch"
      :value="selectedValues"
      :possible-values="possibleValues"
      :show-unknown-values="unknownValuesVisible"
      :initial-include-unknown-values="includeUnknownValues"
      v-bind="$attrs"
      @input="onManualInput"
      @includeUnknownValuesInput="onUnkownColumnsInput"
    />
  </div>
</template>

<style lang="postcss" scoped>
.multi-mode-twinlist {
  display: flex;
  align-items: stretch;
  flex-direction: column;

  &.disabled {
    opacity: 0.5;
  }

  & .label {
    margin-bottom: 10px;
  }
}

</style>
