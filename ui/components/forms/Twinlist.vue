<script>
import MultiselectListBox from '../forms/MultiselectListBox';
import ArrowNextIcon from '../../assets/img/icons/arrow-next.svg?inline';
import ArrowNextDoubleIcon from '../../assets/img/icons/arrow-next-double.svg?inline';
import ArrowPrevIcon from '../../assets/img/icons/arrow-prev.svg?inline';
import ArrowPrevDoubleIcon from '../../assets/img/icons/arrow-prev-double.svg?inline';

const KEY_ENTER = 13;

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
         * Controls the size of the list. Number of visible items (for others user need to scroll)
         * 0 means all
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
        ariaLabelLeft: {
            type: String,
            required: true,
            default: 'Possible Values'
        },
        ariaLabelRight: {
            type: String,
            required: true,
            default: 'Selected Values'
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
            return this.possibleValues.filter(x => !this.chosenValues.includes(x.id));
        },
        rightItems() {
            return this.chosenValues.map(x => this.possibleValueMap[x]);
        }
    },
    methods: {
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
            this.chosenValues = this.chosenValues.filter(x => !items.includes(x)).sort(this.compareByOriginalSorting);
            this.clearSelections();
            this.$emit('input', this.chosenValues);
        },
        moveRightButtonClick() {
            this.moveRight();
        },
        moveAllRightButtonClick() {
            this.moveRight(this.leftItems.map(x => x.id));
        },
        moveAllRightButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.moveAllRightButtonClick();
            }
        },
        moveRightButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.moveRight();
            }
        },
        moveLeftButtonClick() {
            this.moveLeft();
        },
        moveAllLeftButtonClick() {
            this.moveLeft(this.rightItems.map(x => x.id));
        },
        moveLeftButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.moveLeft();
            }
        },
        moveAllLeftButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.moveAllLeftButtonClick();
            }
        },
        leftListBoxDoubleClick(item) {
            this.moveRight([item]);
        },
        leftListBoxShiftDoubleClick(items) {
            this.moveRight(items);
        },
        rightListBoxDoubleClick(item) {
            this.moveLeft([item]);
        },
        rightListBoxShiftDoubleClick(items) {
            this.moveLeft(items);
        },
        leftInput(value) {
            this.selectedLeft = value;
        },
        rightInput(value) {
            this.selectedRight = value;
        },
        keyRightArrow() {
            this.moveRight();
        },
        keyLeftArrow() {
            this.moveLeft();
        },
        hasSelection() {
            return this.chosenValues.length > 0;
        }
    }
};
</script>

<template>
  <div class="twinlist">
    <div class="list">
      <div class="title">{{ ariaLabelLeft }}</div>
      <MultiselectListBox
        ref="left"
        :size="size"
        class="listBox"
        :value="selectedLeft"
        :is-valid="isValid"
        :possible-values="leftItems"
        :aria-label="ariaLabelLeft"
        @doubleClickOnItem="leftListBoxDoubleClick"
        @doubleClickShift="leftListBoxShiftDoubleClick"
        @keyArrowRight="keyRightArrow"
        @input="leftInput"
      />
    </div>
    <div class="buttons">
      <div
        ref="moveRight"
        role="button"
        tabindex="0"
        @click="moveRightButtonClick"
        @keydown="moveRightButtonKey"
      >
        <ArrowNextIcon class="icon" />
      </div>
      <div
        ref="moveAllRight"
        role="button"
        tabindex="0"
        @click="moveAllRightButtonClick"
        @keydown="moveAllRightButtonKey"
      >
        <ArrowNextDoubleIcon class="icon" />
      </div>
      <div
        ref="moveLeft"
        role="button"
        tabindex="0"
        @click="moveLeftButtonClick"
        @keydown="moveLeftButtonKey"
      >
        <ArrowPrevIcon class="icon" />
      </div>
      <div
        ref="moveAllLeft"
        role="button"
        tabindex="0"
        @click="moveAllLeftButtonClick"
        @keydown="moveAllLeftButtonKey"
      >
        <ArrowPrevDoubleIcon class="icon" />
      </div>
    </div>
    <div class="list">
      <div class="title">{{ ariaLabelRight }}</div>
      <MultiselectListBox
        ref="right"
        class="listBox"
        :value="selectedRight"
        :possible-values="rightItems"
        :size="size"
        :aria-label="ariaLabelRight"
        @doubleClickOnItem="rightListBoxDoubleClick"
        @doubleClickShift="rightListBoxShiftDoubleClick"
        @keyArrowLeft="keyLeftArrow"
        @input="rightInput"
      />
    </div>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.twinlist {
  display: flex;
  align-items: stretch;
  flex-wrap: wrap;

  & >>> ul[role=listbox] {
    /* size that the buttons need */
    min-height: 126px;
  }

  & .title {
    font-size: 13px;
  }

  & .list {
    flex: 3;
    display: flex;
    align-items: stretch;
    flex-direction: column;
  }

  & .listBox {
    flex-grow: 1;
  }

  & .buttons {
    flex: 0 0 30px;
    cursor: pointer;
    margin: 41px 0 14px;
  }

  & [role="button"] {
    text-align: center;
    width: 30px;
    height: 24px;
    display: block;
    user-select: none;

    &:hover {
      background: var(--theme-color-porcelain);
    }

    &:active {
      background: var(--theme-color-masala);
      color: var(--theme-color-white);
    }
  }


  & .icon {
    width: 15px;
    height: 15px;
    stroke-width: calc(32px / 15);
    pointer-events: none;
  }
}

</style>
