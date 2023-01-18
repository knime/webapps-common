<script>
import Label from './Label.vue';
import SearchInput from '../forms/SearchInput.vue';
import MultiselectListBox from '../forms/MultiselectListBox.vue';
import Checkboxes from '../forms/Checkboxes.vue';
import ValueSwitch from '../forms/ValueSwitch.vue';
import ArrowNextIcon from '../../assets/img/icons/arrow-next.svg';
import ArrowNextDoubleIcon from '../../assets/img/icons/arrow-next-double.svg';
import ArrowPrevIcon from '../../assets/img/icons/arrow-prev.svg';
import ArrowPrevDoubleIcon from '../../assets/img/icons/arrow-prev-double.svg';

const KEY_ENTER = 13;
const MIN_LIST_SIZE = 5;

export default {
    components: {
        ArrowNextDoubleIcon,
        ArrowNextIcon,
        ArrowPrevDoubleIcon,
        ArrowPrevIcon,
        MultiselectListBox,
        Label,
        SearchInput,
        Checkboxes,
        ValueSwitch
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
        initialPattern: {
            type: String,
            default: ''
        },
        initialCaseSensitiveSearch: {
            default: false,
            type: Boolean
        },
        initialInverseSearch: {
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
        initialSearchTerm: {
            type: String,
            required: false,
            default: ''
        },

        /**
         * Hiding and disabling
         */

        showMode: {
            default: false,
            type: Boolean
        },
        showSearch: {
            default: false,
            type: Boolean
        },
        disabled: {
            default: false,
            type: Boolean
        },

        /**
         * Labels
         */

        leftLabel: {
            type: String,
            required: true,
            default: 'Possible values'
        },
        rightLabel: {
            type: String,
            required: true,
            default: 'Selected values'
        },
        searchLabel: {
            type: String,
            required: false,
            default: 'Search values'
        },
        searchPlaceholder: {
            type: String,
            required: false,
            default: 'Search'
        },
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
         * Controls the size of the list.
         * Number of visible items (for others user need to scroll)
         * - 0 means all
         * - values 1 - 4  are ignored; 5 is minimum
         */
        size: {
            type: Number,
            default: 0,
            validator(val) {
                return val >= 0;
            }
        },
        isValid: {
            default: true,
            type: Boolean
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
            searchTerm: this.initialSearchTerm,
            mode: this.initialMode,
            caseSensitiveSearch: this.initialCaseSensitiveSearch,
            inverseSearch: this.initialInverseSearch
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
        invalidValueIds() {
            return this.chosenValues.filter(x => !this.possibleValueMap[x]);
        },
        matchingValueIds() {
            return this.possibleValues
                .filter(possibleValue => this.itemMatchesSearch(possibleValue))
                .map(possibleValue => possibleValue.id);
        },
        visibleValueIds() {
            if (this.mode === 'manual') {
                const matchingInvalidValueIds = this.invalidValueIds.filter(
                    item => this.itemMatchesSearch(this.generateInvalidItem(item))
                );
                return [...this.matchingValueIds, ...matchingInvalidValueIds];
            }
            return this.possibleValueIds;
        },
        selectedValues() {
            return this.mode === 'manual' ? this.chosenValues : this.matchingValueIds;
        },
        leftItems() {
            return this.possibleValues.filter(value => this.visibleValueIds.includes(value.id) &&
                !this.selectedValues.includes(value.id));
        },
        rightItems() {
            const selectedValues = this.selectedValues
                .map(value => this.possibleValueMap[value] || this.generateInvalidItem(value))
                .filter(value => this.visibleValueIds.includes(value.id));
            return selectedValues;
        },
        listSize() {
            // fixed size even when showing all to prevent height jumping when moving items between lists
            const size = this.size === 0 ? this.possibleValues.length : this.size;
            // limit size to minimum
            return size > MIN_LIST_SIZE ? size : MIN_LIST_SIZE;
        },
        moveAllRightButtonDisabled() {
            return this.leftItems.length === 0;
        },
        moveRightButtonDisabled() {
            return this.selectedLeft.length === 0;
        },
        moveAllLeftButtonDisabled() {
            return this.rightItems.length === 0;
        },
        moveLeftButtonDisabled() {
            return this.rightSelected.length === 0;
        },
        selectionDisabled() {
            return this.disabled || this.mode !== 'manual';
        },
        normalizedSearchTerm() {
            const mode = this.possibleModeMap[this.mode];
            let searchTerm;
            if (this.mode === 'manual') {
                searchTerm = this.searchTerm;
            } else if (this.mode === 'type') {
                searchTerm = this.chosenTypes;
            } else {
                searchTerm = this.chosenPattern;
            }
            return mode.normalize(searchTerm, this.caseSensitiveSearch);
        },
        possibleModes() {
            return [{
                id: 'manual',
                text: 'Manual',
                normalize(searchTerm, caseSensitiveSearch, inverseSearch) {
                    return caseSensitiveSearch ? searchTerm : searchTerm.toLowerCase();
                },
                test(text, normalizedSearchTerm, caseSensitiveSearch, inverseSearch) {
                    const testText = caseSensitiveSearch ? text : text.toLowerCase();
                    const matches = testText.includes(normalizedSearchTerm);
                    return inverseSearch ? !matches : matches;
                }
            }, {
                id: 'wildcard',
                text: 'Wildcard',
                normalize(searchTerm, caseSensitiveSearch, inverseSearch) {
                    // Do a regex search, explicitly matching start and end of the search term.
                    // All regex special character except from "*" (wildcard) are escaped.
                    if (searchTerm.length > 0) {
                        const escapedSearchTerm = searchTerm.replace(/[-[\]{}()+?.,\\^$|#\s]/g, '\\$&');
                        const wildcardSearchTerm = escapedSearchTerm.replace(/\*/g, '.*');
                        searchTerm = `^${wildcardSearchTerm}$`;
                    } else {
                        return { test: () => false };
                    }
                    try {
                        const flags = caseSensitiveSearch ? '' : 'i';
                        return new RegExp(searchTerm, flags);
                    } catch (error) {
                        // In case of an invalid regular expression, an impossible
                        // regex is returned, not matching anything.
                        return new RegExp('$^');
                    }
                },
                test(text, normalizedSearchTerm, caseSensitiveSearch, inverseSearch) {
                    const matches = normalizedSearchTerm.test(text);
                    return inverseSearch ? !matches : matches;
                }
            }, {
                id: 'regex',
                text: 'Regex',
                normalize(searchTerm, caseSensitiveSearch, inverseSearch) {
                    try {
                        const flags = caseSensitiveSearch ? '' : 'i';
                        return new RegExp(`^${searchTerm}$`, flags);
                    } catch (error) {
                        // In case of an invalid regular expression, an impossible
                        // regex is returned, not matching anything.
                        return new RegExp('$^');
                    }
                },
                test(text, normalizedSearchTerm, caseSensitiveSearch, inverseSearch) {
                    const matches = normalizedSearchTerm.test(text);
                    return inverseSearch ? !matches : matches;
                }
            }, ...this.withTypes
                ? [{
                    id: 'type',
                    text: 'Type',
                    normalize(selectedTypes) {
                        return { test: (type) => selectedTypes.includes(type) };
                    },
                    test(type, normalizedSearchTerm) {
                        return normalizedSearchTerm.test(type);
                    }
                }]
                : []];
        },
        possibleModeIds() {
            return this.possibleModes.map(mode => mode.id);
        },
        possibleModeMap() {
            // convert [{id: "key1", text: "asdf"}, ...] to {"key1": {id:"key1", text: "asdf"} ... }
            return Object.assign({}, ...this.possibleModes.map(obj => ({ [obj.id]: obj })));
        },
        inputLabel() {
            if (this.mode === 'manual') {
                return this.searchLabel;
            } else if (this.mode === 'type') {
                return this.selectedTypesLabel;
            } else {
                return this.patternLabel;
            }
        },
        value() {
            if (this.mode === 'manual') {
                return this.chosenValues;
            } else {
                return this.rightItems.map(item => item.id);
            }
        }
    },
    watch: {
        manuallySelected(newValue) {
            this.chosenValues = newValue;
        },
        possibleValues(newPossibleValues) {
            // Required to prevent invalid values from appearing (e.g. missing b/c of upstream filtering)
            let allValues = newPossibleValues.reduce((arr, valObj) => {
                arr.push(...Object.values(valObj));
                return arr;
            }, []);
            // Reset chosenValues as subset of original to prevent re-execution from resetting value
            this.chosenValues = this.chosenValues.filter(item => allValues.includes(item));
        },
        value(newVal, oldVal) {
            if (newVal.length !== oldVal.length || oldVal.some((item, i) => item !== newVal[i])) {
                this.emitSelectedValues();
            }
        }
    },
    mounted() {
        this.emitSelectedValues();
    },
    methods: {
        emitSelectedValues() {
            this.$emit('input', this.value, this.mode === 'manual');
        },
        generateInvalidItem(id) {
            return { id, text: `(MISSING) ${id}`, invalid: true };
        },
        compareByOriginalSorting(a, b) {
            return this.possibleValueIds.indexOf(a) - this.possibleValueIds.indexOf(b);
        },
        clearSelections() {
            this.$refs.right.clearSelection();
            this.$refs.left.clearSelection();
        },
        moveRight(items) {
            // add all left items to our values
            items = items || this.selectedLeft;
            this.chosenValues = [...items, ...this.chosenValues].sort(this.compareByOriginalSorting);
            this.clearSelections();
        },
        moveLeft(items) {
            // remove all right values from or selectedValues
            items = items || this.rightSelected;
            // add the invalid items to the possible items
            let invalidItems = items.filter(x => this.invalidValueIds.includes(x));
            invalidItems.forEach(x => this.invalidPossibleValueIds.add(x));
            this.chosenValues = this.chosenValues.filter(x => !items.includes(x)).sort(this.compareByOriginalSorting);
            this.clearSelections();
        },
        onMoveRightButtonClick() {
            this.moveRight();
        },
        onMoveAllRightButtonClick() {
            // only move valid items
            this.moveRight(this.leftItems.filter(x => !x.invalid).map(x => x.id));
        },
        onMoveAllRightButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.onMoveAllRightButtonClick();
            }
        },
        onMoveRightButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.moveRight();
            }
        },
        onMoveLeftButtonClick() {
            this.moveLeft();
        },
        onMoveAllLeftButtonClick() {
            this.moveLeft(this.rightItems.map(x => x.id));
        },
        onMoveLeftButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.moveLeft();
            }
        },
        onMoveAllLeftButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.onMoveAllLeftButtonClick();
            }
        },
        onLeftListBoxDoubleClick(item) {
            this.moveRight([item]);
        },
        onLeftListBoxShiftDoubleClick(items) {
            this.moveRight(items);
        },
        onRightListBoxDoubleClick(item) {
            this.moveLeft([item]);
        },
        onRightListBoxShiftDoubleClick(items) {
            this.moveLeft(items);
        },
        onLeftInput(value) {
            if (value.length > 0) {
                this.$refs.right.clearSelection();
            }
            this.selectedLeft = value;
        },
        onRightInput(value) {
            if (value.length > 0) {
                this.$refs.left.clearSelection();
            }
            this.rightSelected = value;
        },
        onKeyRightArrow() {
            this.moveRight();
        },
        onKeyLeftArrow() {
            this.moveLeft();
        },
        onSearchInput(value) {
            if (this.mode === 'manual') {
                this.searchTerm = value;
            } else {
                this.chosenPattern = value;
                this.$emit('patternInput', value);
            }
        },
        onTypeInput(value) {
            this.chosenTypes = value;
            this.$emit('typesInput', value);
        },
        onModeChange(value) {
            if (this.possibleModeIds.indexOf(value) !== -1) {
                this.mode = value;
                if (this.mode !== 'manual') {
                    this.searchTerm = '';
                }
                this.$emit('modeInput', value);
            }
        },
        onToggleCaseSensitiveSearch(value) {
            this.caseSensitiveSearch = value;
            this.$emit('caseSensitiveSearchInput', value);
        },
        onToggleInvserseSearch(value) {
            this.inverseSearch = value;
            this.$emit('inverseSearchInput', value);
        },
        hasSelection() {
            return this.selectedValues.length > 0;
        },
        validate() {
            let isValid = !this.rightItems.some(x => x.invalid);
            return { isValid, errorMessage: isValid ? null : 'One or more of the selected items is invalid.' };
        },
        itemMatchesSearch(item) {
            const mode = this.possibleModeMap[this.mode];
            return mode.test(item[this.mode === 'type' ? 'type' : 'text'], this.normalizedSearchTerm,
                this.caseSensitiveSearch, this.inverseSearch);
        }
    }
};
</script>

<template>
  <div
    class="twinlist"
    :class="{disabled}"
  >
    <Label
      v-if="showMode"
      v-slot="{ labelForId }"
      :text="modeLabel"
      class="search-wrapper"
      compact
    >
      <ValueSwitch
        :id="labelForId"
        ref="mode"
        :size="listSize"
        :value="mode"
        :disabled="disabled"
        :possible-values="possibleModes"
        @input="onModeChange"
      />
    </Label>
    <Label
      v-if="(mode === 'manual' && showSearch) ||
        mode === 'regex' ||
        mode === 'wildcard' ||
        (mode === 'type' && possibleTypes.length > 0)"
      v-slot="{ labelForId }"
      :text="inputLabel"
      class="search-wrapper"
      compact
    >
      <SearchInput
        v-if="mode !== 'type'"
        :id="labelForId"
        ref="search"
        :size="listSize"
        :placeholder="searchPlaceholder"
        :value="mode === 'manual' ? searchTerm : chosenPattern"
        :label="searchLabel"
        :initial-case-sensitive-search="initialCaseSensitiveSearch"
        :initial-inverse-search="initialInverseSearch"
        show-case-sensitive-search-button
        show-inverse-search-button
        :disabled="disabled"
        @input="onSearchInput"
        @toggle-case-sensitive-search="onToggleCaseSensitiveSearch"
        @toggle-inverse-search="onToggleInvserseSearch"
      />
      <Checkboxes
        v-else
        :value="chosenTypes"
        :possible-values="possibleTypes"
        :disabled="disabled"
        @input="onTypeInput"
      />
    </Label>
    <div class="header">
      <div class="title">{{ leftLabel }}</div>
      <div class="space" />
      <div class="title">{{ rightLabel }}</div>
    </div>
    <div :class="['lists', { disabled }] ">
      <MultiselectListBox
        ref="left"
        :size="listSize"
        class="listBox"
        :value="selectedLeft"
        :is-valid="isValid"
        :possible-values="leftItems"
        :aria-label="leftLabel"
        :disabled="selectionDisabled"
        @doubleClickOnItem="onLeftListBoxDoubleClick"
        @doubleClickShift="onLeftListBoxShiftDoubleClick"
        @keyArrowRight="onKeyRightArrow"
        @input="onLeftInput"
      />
      <div
        class="buttons"
      >
        <div
          ref="moveRight"
          :class="{ disabled: moveRightButtonDisabled || selectionDisabled }"
          role="button"
          tabindex="0"
          @click="onMoveRightButtonClick"
          @keydown="onMoveRightButtonKey"
        >
          <ArrowNextIcon class="icon" />
        </div>
        <div
          ref="moveAllRight"
          :class="{ disabled: moveAllRightButtonDisabled || selectionDisabled }"
          role="button"
          tabindex="0"
          @click="onMoveAllRightButtonClick"
          @keydown="onMoveAllRightButtonKey"
        >
          <ArrowNextDoubleIcon class="icon" />
        </div>
        <div
          ref="moveLeft"
          :class="{ disabled: moveLeftButtonDisabled || selectionDisabled }"
          role="button"
          tabindex="0"
          @click="onMoveLeftButtonClick"
          @keydown="onMoveLeftButtonKey"
        >
          <ArrowPrevIcon class="icon" />
        </div>
        <div
          ref="moveAllLeft"
          :class="{ disabled: moveAllLeftButtonDisabled || selectionDisabled }"
          role="button"
          tabindex="0"
          @click="onMoveAllLeftButtonClick"
          @keydown="onMoveAllLeftButtonKey"
        >
          <ArrowPrevDoubleIcon class="icon" />
        </div>
      </div>
      <MultiselectListBox
        ref="right"
        class="listBox"
        :value="rightSelected"
        :possible-values="rightItems"
        :size="listSize"
        :aria-label="rightLabel"
        :disabled="selectionDisabled"
        @doubleClickOnItem="onRightListBoxDoubleClick"
        @doubleClickShift="onRightListBoxShiftDoubleClick"
        @keyArrowLeft="onKeyLeftArrow"
        @input="onRightInput"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.twinlist {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  --button-bar-width: 30px;

  & .title {
    font-weight: 500;
    font-family: var(--theme-text-medium-font-family);
    color: var(--theme-text-medium-color);
    font-size: 13px;
    line-height: 18px;
    margin-bottom: 3px;
  }

  & .lists,
  & .header {
    display: flex;
    align-items: stretch;
    flex-direction: row;

    &.disabled {
      opacity: 0.5;
    }
  }

  & .space,
  & .buttons {
    flex: 0 0 var(--button-bar-width);
  }

  & .title,
  & .listBox {
    flex: 3 1 auto;
    max-width: calc(50% - (var(--button-bar-width) / 2));
  }

  & .listBox {
    display: flex;
    align-items: stretch;
    flex-direction: row;
  }

  & .buttons {
    flex: 0 0 30px;
    align-items: center;
    justify-content: center;
    display: flex;
    flex-direction: column;
  }

  & [role="button"] {
    cursor: pointer;
    width: 30px;
    height: 24px;
    display: flex;
    align-items: center;
    justify-content: center;
    user-select: none;
    background: var(--theme-select-control-background-color);
    color: var(--theme-select-control-foreground-color);

    &:hover {
      background: var(--theme-select-control-background-color-hover);
    }

    & .icon {
      width: 15px;
      height: 15px;
      stroke-width: calc(32px / 15);
      pointer-events: none;
      stroke: var(--theme-select-control-foreground-color-hover);
    }

    &:focus {
      outline: none;
      background: var(--theme-select-control-background-color-focus);
      color: var(--theme-select-control-foreground-color-focus);

      & .icon {
        stroke: var(--theme-select-control-foreground-color-focus);
      }
    }

    &:active {
      background: var(--theme-select-control-background-color-focus);
      color: var(--theme-select-control-foreground-color-focus);

      & .icon {
        stroke: var(--theme-select-control-foreground-color-focus);
      }
    }

    /* disabled icons */
    &.disabled {
      cursor: default;
      opacity: 0.5;
      pointer-events: none;
      background: var(--theme-select-control-background-color-disabled);

      & .icon {
        stroke: var(--theme-select-control-foreground-color);
      }

      &:focus,
      &:active,
      &:hover {
        & .icon {
          stroke: var(--theme-select-control-foreground-color);
        }

        background: transparent;
        color: var(--theme-select-control-foreground-color);
      }
    }
  }

  & .search-wrapper {
    margin-bottom: 10px;
  }
}

</style>
