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
        leftItems() {
            return this.possibleValues.filter(x => !this.chosenValues.includes(x.id));
        },
        rightItems() {
            return this.chosenValues.map(x => this.possibleValueMap[x]);
        }
    },
    methods: {
        clearSelections() {
            this.selectedRight = [];
            this.selectedLeft = [];
            // this fixes the internal handling of selected values which gets not updated by :value binding in this case
            // TODO: improve?
            this.$refs.right.selectedValues = [];
            this.$refs.left.selectedValues = [];
        },
        moveRight(items) {
            // add all left items to our values
            items = items || this.selectedLeft;
            this.chosenValues = [...items, ...this.chosenValues].sort();
            this.clearSelections();
            this.$emit('input', this.chosenValues);
        },
        moveLeft(items) {
            // remove all right values from or selectedValues
            items = items || this.selectedRight;
            this.chosenValues = this.chosenValues.filter(x => !items.includes(x)).sort();
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
                this.moveRight();
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
        rightListBoxDoubleClick(item) {
            this.moveLeft([item]);
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
        }
    }
};
</script>

<template>
  <div class="twinlist">
    <MultiselectListBox
      ref="left"
      class="list"
      :size="size"
      :value="selectedLeft"
      :possible-values="leftItems"
      :aria-label="ariaLabelLeft"
      @doubleClickOnItem="leftListBoxDoubleClick"
      @keyArrowRight="keyRightArrow"
      @input="leftInput"
    />
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
    <MultiselectListBox
      ref="right"
      class="list"
      :value="selectedRight"
      :possible-values="rightItems"
      :size="size"
      :aria-label="ariaLabelRight"
      @doubleClickOnItem="rightListBoxDoubleClick"
      @keyArrowLeft="keyLeftArrow"
      @input="rightInput"
    />
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.twinlist {
  display: flex;
  align-items: stretch;

  & >>> ul[role=listbox] {
    min-height: 100%;
  }

  & > .list {
    flex: 3;
  }

  & > .buttons {
    flex: 0 0 30px;
    cursor: pointer;
    margin: 15px 0;
  }

  & > div > [role="button"] {
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
