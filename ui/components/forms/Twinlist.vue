<script>
import MultiselectListBox from '../forms/MultiselectListBox';
const KEY_ENTER = 13;

export default {
    components: {
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
        rightButtonClick() {
            this.moveRight();
        },
        rightButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.moveRight();
            }
        },
        leftButtonClick() {
            this.moveLeft();
        },
        leftButtonKey(e) {
            if (e.keyCode === KEY_ENTER) { /* ENTER */
                this.moveLeft();
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
            // move focus with keys
            this.$refs.right.focus();
        },
        keyLeftArrow() {
            this.moveLeft();
            this.$refs.left.focus();
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
    <div>
      <div
        ref="moveRight"
        role="button"
        tabindex="0"
        @click="rightButtonClick"
        @keydown="rightButtonKey"
      >
        &gt;
      </div>
      <div
        ref="moveLeft"
        role="button"
        tabindex="0"
        @click="leftButtonClick"
        @keydown="leftButtonKey"
      >
        &lt;
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

  & > .list {
    flex: 3;
  }

  & > div {
    flex: 1;
  }

  & > div > [role="button"] {
    background: var(--theme-color-stone-gray);
    text-align: center;
    margin: 0 1em;
    display: block;
    user-select: none;
  }
}

</style>
