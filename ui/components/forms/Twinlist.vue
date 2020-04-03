<script>
import MultiselectListBox from '../forms/MultiselectListBox';
import ArrowNextIcon from '../../assets/img/icons/arrow-next.svg?inline';
import ArrowNextDoubleIcon from '../../assets/img/icons/arrow-next-double.svg?inline';
import ArrowPrevIcon from '../../assets/img/icons/arrow-prev.svg?inline';
import ArrowPrevDoubleIcon from '../../assets/img/icons/arrow-prev-double.svg?inline';

const KEY_ENTER = 13;
const MIN_LIST_SIZE = 5;

export default {
    components: {
        ArrowNextDoubleIcon,
        ArrowNextIcon,
        ArrowPrevDoubleIcon,
        ArrowPrevIcon,
        MultiselectListBox
    },
    props: {
        value: {
            type: Array,
            default: () => []
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
        labelLeft: {
            type: String,
            required: true,
            default: 'Possible values'
        },
        labelRight: {
            type: String,
            required: true,
            default: 'Selected values'
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
            invalidPossibleValues: new Set(),
            selectedRight: [],
            selectedLeft: []
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
        leftItems() {
            const invalidItems = [...this.invalidPossibleValues].map(x => this.generateInvalidItem(x));
            return [...this.possibleValues, ...invalidItems].filter(x => !this.chosenValues.includes(x.id));
        },
        rightItems() {
            return this.chosenValues.map(x => this.possibleValueMap[x] || this.generateInvalidItem(x));
        },
        invalidValues() {
            return this.chosenValues.filter(x => !this.possibleValueMap[x]);
        },
        listSize() {
            if (this.size === 0) {
                // fixed size even when showing all to prevent height jumping when moving items between lists
                return this.possibleValues.length;
            }
            return this.size > MIN_LIST_SIZE ? this.size : MIN_LIST_SIZE;
        },
        hasInvalidChosenValues() {
            return this.rightItems.some(x => x.invalid);
        }
    },
    watch: {
        value(newValue) {
            this.chosenValues = newValue;
        }
    },
    methods: {
        generateInvalidItem(id) {
            return { id, text: `Invalid: ${id}`, invalid: true };
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
            this.$emit('input', this.chosenValues);
        },
        moveLeft(items) {
            // remove all right values from or selectedValues
            items = items || this.selectedRight;
            // add the invalid items to the possible items
            let invalidItems = items.filter(x => this.invalidValues.includes(x));
            invalidItems.forEach(x => this.invalidPossibleValues.add(x));
            this.chosenValues = this.chosenValues.filter(x => !items.includes(x)).sort(this.compareByOriginalSorting);
            this.clearSelections();
            this.$emit('input', this.chosenValues);
        },
        onMoveRightButtonClick() {
            this.moveRight();
        },
        onMoveAllRightButtonClick() {
            this.moveRight(this.leftItems.map(x => x.id));
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
            this.selectedLeft = value;
        },
        onRightInput(value) {
            this.selectedRight = value;
        },
        onKeyRightArrow() {
            this.moveRight();
        },
        onKeyLeftArrow() {
            this.moveLeft();
        },
        hasSelection() {
            return this.chosenValues.length > 0;
        },
        validate() {
            return !this.hasInvalidChosenValues;
        }
    }
};
</script>

<template>
  <div class="twinlist">
    <div class="header">
      <div class="title">{{ labelLeft }}</div>
      <div class="space" />
      <div class="title">{{ labelRight }}</div>
    </div>
    <div class="lists">
      <MultiselectListBox
        ref="left"
        :size="listSize"
        class="listBox"
        :value="selectedLeft"
        :is-valid="isValid"
        :possible-values="leftItems"
        :aria-label="labelLeft"
        @doubleClickOnItem="onLeftListBoxDoubleClick"
        @doubleClickShift="onLeftListBoxShiftDoubleClick"
        @keyArrowRight="onKeyRightArrow"
        @input="onLeftInput"
      />
      <div class="buttons">
        <div
          ref="moveRight"
          role="button"
          tabindex="0"
          @click="onMoveRightButtonClick"
          @keydown="onMoveRightButtonKey"
        >
          <ArrowNextIcon class="icon" />
        </div>
        <div
          ref="moveAllRight"
          role="button"
          tabindex="0"
          @click="onMoveAllRightButtonClick"
          @keydown="onMoveAllRightButtonKey"
        >
          <ArrowNextDoubleIcon class="icon" />
        </div>
        <div
          ref="moveLeft"
          role="button"
          tabindex="0"
          @click="onMoveLeftButtonClick"
          @keydown="onMoveLeftButtonKey"
        >
          <ArrowPrevIcon class="icon" />
        </div>
        <div
          ref="moveAllLeft"
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
        :value="selectedRight"
        :possible-values="rightItems"
        :size="listSize"
        :is-valid="true"
        :aria-label="labelRight"
        @doubleClickOnItem="onRightListBoxDoubleClick"
        @doubleClickShift="onRightListBoxShiftDoubleClick"
        @keyArrowLeft="onKeyLeftArrow"
        @input="onRightInput"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.twinlist {
  display: flex;
  align-items: stretch;
  flex-direction: column;
  --button-bar-width: 30px;

  & .title {
    font-size: 13px;
  }

  & .lists,
  & .header {
    display: flex;
    align-items: stretch;
    flex-direction: row;
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

    &:hover {
      background: var(--theme-color-porcelain);
    }

    & .icon {
      width: 15px;
      height: 15px;
      stroke-width: calc(32px / 15);
      pointer-events: none;
      stroke: var(--theme-color-masala);
    }

    &:focus {
      outline: none;
      background: var(--theme-color-masala);
      color: var(--theme-color-white);

      & .icon {
        stroke: var(--theme-color-white);
      }
    }

    &:active {
      background: var(--theme-color-masala);
      color: var(--theme-color-white);

      & .icon {
        stroke: var(--theme-color-white);
      }
    }
  }
}

</style>
