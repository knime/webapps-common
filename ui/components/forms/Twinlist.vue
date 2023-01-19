<script>
import Label from './Label.vue';
import SearchInput from '../forms/SearchInput.vue';
import MultiselectListBox from '../forms/MultiselectListBox.vue';
import ArrowNextIcon from '../../assets/img/icons/arrow-next.svg';
import ArrowNextDoubleIcon from '../../assets/img/icons/arrow-next-double.svg';
import ArrowPrevIcon from '../../assets/img/icons/arrow-prev.svg';
import ArrowPrevDoubleIcon from '../../assets/img/icons/arrow-prev-double.svg';
import { filters } from '../../../util/filters';

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
        SearchInput
    },
    props: {

        /**
         * initial values
         */
        value: {
            type: Array,
            default: () => []
        },
        initialCaseSensitiveSearch: {
            default: false,
            type: Boolean
        },
        initialSearchTerm: {
            type: String,
            required: false,
            default: ''
        },

        /**
         * Hiding and disabling
         */
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
            chosenValues: this.value,
            invalidPossibleValueIds: new Set(),
            rightSelected: [],
            selectedLeft: [],
            searchTerm: this.initialSearchTerm,
            caseSensitiveSearch: this.initialCaseSensitiveSearch
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
        invalidValueIds() {
            return this.chosenValues.filter(x => !this.possibleValueMap[x]);
        },
        visibleValueIds() {
            const matchingInvalidValueIds = this.invalidValueIds.filter(
                item => this.itemMatchesSearch(this.generateInvalidItem(item))
            );
            const matchingValidIds = this.possibleValues
                .filter(possibleValue => this.itemMatchesSearch(possibleValue))
                .map(possibleValue => possibleValue.id);
            return [...matchingValidIds, ...matchingInvalidValueIds];
        },
        leftItems() {
            return this.possibleValues.filter(value => this.visibleValueIds.includes(value.id) &&
                !this.chosenValues.includes(value.id));
        },
        rightItems() {
            return this.chosenValues
                .map(value => this.possibleValueMap[value] || this.generateInvalidItem(value))
                .filter(value => this.visibleValueIds.includes(value.id));
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
        normalizedSearchTerm() {
            return filters.search.normalize(this.searchTerm, this.caseSensitiveSearch);
        }
    },
    watch: {
        value(newValue) {
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
        chosenValues(newVal, oldVal) {
            if (newVal.length !== oldVal.length || oldVal.some((item, i) => item !== newVal[i])) {
                this.$emit('input', this.chosenValues);
            }
        }
    },
    methods: {
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
            this.searchTerm = value;
        },
        hasSelection() {
            return this.chosenValues.length > 0;
        },
        validate() {
            let isValid = !this.rightItems.some(x => x.invalid);
            return { isValid, errorMessage: isValid ? null : 'One or more of the selected items is invalid.' };
        },
        itemMatchesSearch(item) {
            return filters.search.test(item.text, this.normalizedSearchTerm,
                this.caseSensitiveSearch, false);
        }
    }
};
</script>

<template>
  <div class="twinlist">
    <Label
      v-if="showSearch"
      v-slot="{ labelForId }"
      :text="searchLabel"
      class="search-wrapper"
      compact
    >
      <SearchInput
        :id="labelForId"
        ref="search"
        :placeholder="searchPlaceholder"
        :value="searchTerm"
        :label="searchLabel"
        :initial-case-sensitive-search="initialCaseSensitiveSearch"
        show-case-sensitive-search-button
        :disabled="disabled"
        @input="onSearchInput"
        @toggle-case-sensitive-search="(event) => caseSensitiveSearch = event"
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
        :disabled="disabled"
        @doubleClickOnItem="onLeftListBoxDoubleClick"
        @doubleClickShift="onLeftListBoxShiftDoubleClick"
        @keyArrowRight="onKeyRightArrow"
        @input="onLeftInput"
      />
      <div class="buttons">
        <div
          ref="moveRight"
          :class="{ disabled: moveRightButtonDisabled || disabled }"
          role="button"
          tabindex="0"
          @click="onMoveRightButtonClick"
          @keydown="onMoveRightButtonKey"
        >
          <ArrowNextIcon class="icon" />
        </div>
        <div
          ref="moveAllRight"
          :class="{ disabled: moveAllRightButtonDisabled || disabled }"
          role="button"
          tabindex="0"
          @click="onMoveAllRightButtonClick"
          @keydown="onMoveAllRightButtonKey"
        >
          <ArrowNextDoubleIcon class="icon" />
        </div>
        <div
          ref="moveLeft"
          :class="{ disabled: moveLeftButtonDisabled || disabled }"
          role="button"
          tabindex="0"
          @click="onMoveLeftButtonClick"
          @keydown="onMoveLeftButtonKey"
        >
          <ArrowPrevIcon class="icon" />
        </div>
        <div
          ref="moveAllLeft"
          :class="{ disabled: moveAllLeftButtonDisabled || disabled }"
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
        :disabled="disabled"
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
