<script>
let count = 0;

export default {
    props: {
        id: {
            type: String,
            default() {
                return `MultiselectListBox-${count++}`;
            }
        },
        value: {
            type: Array,
            default: () => []
        },
        /**
         * If enabled the single click will allow the user to select multiple items, otherwise this only works with
         * CTRL + Click (similar to <select> html widgets)
         */
        multiselectByClick: {
            type: Boolean,
            default: false
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
        ariaLabel: {
            type: String,
            required: true
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
            selectedValues: this.value,
            // indices for mouse and keyboard nav
            currentKeyNavIndex: 0,
            shiftStartIndex: -1,
            draggingStartIndex: -1,
            draggingInverseMode: false,
            // visual
            optionLineHeight: 20
        };
    },
    computed: {
        cssStyleSize() {
            const pxSize = `${this.size * this.optionLineHeight}px`;
            return this.size > 0 ? { height: pxSize } : {};
        }
    },
    mounted() {
        window.addEventListener('mouseup', this.stopDrag);
        // set key nav index to last value
        if (this.value.length > 0) {
            let lastItem = this.value[this.value.length - 1];
            this.currentKeyNavIndex = this.possibleValues.map(x => x.id).indexOf(lastItem);
        }
    },
    created() {
        this.debouncedHandleCtrlClick = this.debounce(this.handleCtrlClick, 150);
    },
    methods: {
        // eslint-disable-next-line no-magic-numbers
        debounce(callback, wait = 250) {
            let timer;
            let lastCall = 0;
            return (...args) => {
                clearTimeout(timer);
                const now = Date.now();
                const timeFromLastCall = now - lastCall;

                if (timeFromLastCall > wait) {
                    lastCall = now;
                    callback(...args);
                } else {
                    timer = setTimeout(() => {
                        lastCall = now;
                        callback(...args);
                    }, wait);
                }
            };
        },
        isCurrentValue(candidate) {
            return this.value.includes(candidate);
        },
        handleCtrlClick(value, index) {
            this.currentKeyNavIndex = index;
            this.toggleSelection(value);
        },
        handleShiftClick(value, clickedIndex) {
            this.setSelected(this.getPossibleValuesInSection(this.currentKeyNavIndex, clickedIndex));
        },
        /**
         * Returns all value ids (String) for two indices no matter which one is the start/end index
         * @param {Number} firstIndex - index a
         * @param {Number} secondIndex - index b
         * @returns {String[]}
         */
        getPossibleValuesInSection(firstIndex, secondIndex) {
            let start = firstIndex > secondIndex ? secondIndex : firstIndex;
            let end = firstIndex > secondIndex ? firstIndex : secondIndex;
            return this.possibleValues.slice(start, end + 1).map(x => x.id);
        },
        startDrag(e) {
            // do not start drag if we press shift
            if (e.shiftKey) {
                return;
            }
            // enable inverse mode on ctrl key
            if (e.ctrlKey || e.metaKey) {
                this.draggingInverseMode = true;
            }
            let index = e.target.getAttribute('data-option-index');
            if (index) {
                this.draggingStartIndex = Number(index);
            }
        },
        onDrag(e) {
            if (this.draggingStartIndex !== -1) {
                let dataIndex = e.target.getAttribute('data-option-index');
                if (!dataIndex) {
                    return;
                }
                let index = Number(dataIndex);
                let sectionValues = this.getPossibleValuesInSection(this.draggingStartIndex, index);
                // inverse mode means we remove all selected values from the current selection
                if (this.draggingInverseMode) {
                    sectionValues = this.selectedValues.filter(x => !sectionValues.includes(x));
                }
                this.setSelected(sectionValues);
            }
        },
        stopDrag(e) {
            this.draggingStartIndex = -1;
            this.draggingInverseMode = false;
        },
        handleClick($event, value, index) {
            $event.preventDefault();
            if ($event.metaKey || $event.ctrlKey) {
                this.debouncedHandleCtrlClick(value, index);
                return; // end here
            }
            if ($event.shiftKey) {
                this.handleShiftClick(value, index);
                return; // end here
            }
            // regular click
            if (!this.multiselectByClick) {
                this.selectedValues = [];
            }
            this.currentKeyNavIndex = index;
            this.toggleSelection(value);
        },
        handleDblClick(id, index) {
            this.$emit('doubleClickOnItem', id, index);
        },
        handleShiftDblClick(id, index) {
            this.$emit('doubleClickShift', this.selectedValues);
        },
        addToSelection(value) {
            let added = false;
            let selectedValues = this.selectedValues;
            if (!selectedValues.includes(value)) {
                selectedValues.push(value);
                added = true;
            }
            this.setSelected(selectedValues);
            return added;
        },
        removeFromSelection(value) {
            let removed = false;
            let selectedValues = this.selectedValues;
            if (selectedValues.includes(value)) {
                selectedValues.splice(selectedValues.indexOf(value), 1);
                removed = true;
            }
            this.setSelected(selectedValues);
            return removed;
        },
        toggleSelection(value) {
            if (this.selectedValues.includes(value)) {
                this.removeFromSelection(value);
            } else {
                this.addToSelection(value);
            }
        },
        setSelectedNoShiftReset(values) {
            consola.trace('MultiselectListBox setSelected on', values);
            this.selectedValues = values;
            this.$emit('input', values);
        },
        setSelected(values) {
            // reset shift start index on every change to selected values but shift operations itself
            this.shiftStartIndex = -1;
            this.setSelectedNoShiftReset(values);
        },
        setSelectedToIndex(index) {
            let item = this.possibleValues[index];
            if (item && item.id) {
                this.setSelected([item.id]);
            }
        },
        scrollToCurrent() {
            let listBoxNode = this.$refs.ul;
            if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
                let element = this.$refs.options[this.currentKeyNavIndex];
                let scrollBottom = listBoxNode.clientHeight + listBoxNode.scrollTop;
                let elementBottom = element.offsetTop + element.offsetHeight;
                if (elementBottom > scrollBottom) {
                    listBoxNode.scrollTop = elementBottom - listBoxNode.clientHeight;
                } else if (element.offsetTop < listBoxNode.scrollTop) {
                    listBoxNode.scrollTop = element.offsetTop;
                }
            }
        },
        onArrowDown() {
            let next = this.currentKeyNavIndex + 1;
            if (next >= this.possibleValues.length) {
                return;
            }
            this.setSelectedToIndex(next);
            this.currentKeyNavIndex = next;
            this.scrollToCurrent();
        },
        onArrowUp() {
            let next = this.currentKeyNavIndex - 1;
            if (next < 0) {
                return;
            }
            this.setSelectedToIndex(next);
            this.currentKeyNavIndex = next;
            this.scrollToCurrent();
        },
        onArrowDownShift() {
            // set start index if this is the first shift up/down op
            if (this.shiftStartIndex === -1) {
                this.shiftStartIndex = this.currentKeyNavIndex;
            }
            let next = this.currentKeyNavIndex + 1;
            if (next >= this.possibleValues.length) {
                return;
            }
            this.setSelectedNoShiftReset(this.getPossibleValuesInSection(this.shiftStartIndex, next));
            this.currentKeyNavIndex = next;
            this.scrollToCurrent();
        },
        onArrowUpShift() {
            // set start index if this is the first shift up/down op
            if (this.shiftStartIndex === -1) {
                this.shiftStartIndex = this.currentKeyNavIndex;
            }
            let next = this.currentKeyNavIndex - 1;
            if (next < 0) {
                return;
            }
            this.setSelectedNoShiftReset(this.getPossibleValuesInSection(this.shiftStartIndex, next));
            this.currentKeyNavIndex = next;
            this.scrollToCurrent();
        },
        onEndKey() {
            let next = this.possibleValues.length - 1;
            this.setSelectedToIndex(next);
            this.currentKeyNavIndex = next;
            this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
        },
        onHomeKey() {
            let next  = 0;
            this.setSelectedToIndex(next);
            this.currentKeyNavIndex = next;
            this.$refs.ul.scrollTop = 0;
        },
        onArrowLeft() {
            this.$emit('keyArrowLeft', this.selectedValues);
        },
        onArrowRight() {
            this.$emit('keyArrowRight', this.selectedValues);
        },
        onActivation() {
            this.$emit('activated', this.selectedValues);
        },
        selectAll() {
            this.setSelected(this.possibleValues.map(x => x.id));
        },
        hasSelection() {
            return this.selectedValues.length > 0;
        },
        getCurrentKeyNavItem() {
            try {
                return this.possibleValues[this.currentKeyNavIndex];
            } catch (e) {
                return {
                    id: '',
                    text: ''
                };
            }
        },
        generateOptionId(item) {
            if (!item) {
                return '';
            }
            let cleanId = item.id.replace(/[^\w]/gi, '');
            return `option-${this.id}-${cleanId}`;
        },
        focus() {
            this.$refs.ul.focus();
        },
        clearSelection() {
            this.setSelected([]);
        }
    }
};
</script>

<template>
  <div
    :class="{ 'invalid' : !isValid, 'multiselect-list-box': true}"
    :style="cssStyleSize"
  >
    <ul
      ref="ul"
      role="listbox"
      tabindex="0"
      :aria-label="ariaLabel"
      :aria-activedescendant="generateOptionId(getCurrentKeyNavItem())"
      @keydown.ctrl.a.prevent.exact="selectAll"
      @keydown.up.prevent.exact="onArrowUp"
      @keydown.down.prevent.exact="onArrowDown"
      @keydown.shift.up.prevent.exact="onArrowUpShift"
      @keydown.shift.down.prevent.exact="onArrowDownShift"
      @keydown.left.prevent.exact="onArrowLeft"
      @keydown.right.prevent.exact="onArrowRight"
      @keydown.home.prevent.exact="onHomeKey"
      @keydown.end.prevent.exact="onEndKey"
      @keydown.space.prevent.exact="onActivation"
      @keydown.enter.prevent.exact="onActivation"
      @mousedown="startDrag"
      @mousemove="onDrag"
    >
      <li
        v-for="(item, index) of possibleValues"
        :id="generateOptionId(item)"
        :key="`listbox-${item.id}`"
        ref="options"
        role="option"
        :data-option-index="index"
        :style="{ 'line-height': `${optionLineHeight}px` }"
        :class="{
          'selected': isCurrentValue(item.id),
          'noselect' :true
        }"
        :aria-selected="isCurrentValue(item.id)"
        @click="handleClick($event, item.id, index)"
        @dblclick.shift="handleShiftDblClick(item.id, index)"
        @dblclick.exact="handleDblClick(item.id, index)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

.multiselect-list-box {
  position: relative; /* required by .invalid::before */
  display: flex;
  align-items: stretch;
  flex-direction: column;

  & [role="listbox"] {
    height: 100%;
    flex-grow: 1;
    font-size: 14px;
    min-height: 20px;
    padding: 0;
    margin: 0;
    background: var(--theme-color-white);
    border: 1px solid var(--theme-color-stone-gray);
  }

  &.invalid {
    &::before {
      content: '';
      position: absolute;
      width: 3px;
      left: 0;
      margin: 0;
      top: 0;
      bottom: 0;
      z-index: 10;
      background-color: var(--theme-color-error);
    }
  }

  & [role="option"] {
    display: block;
    padding: 0 10px 0 10px;
    position: relative;
  }

  & [role="option"]:hover {
    background: var(--theme-color-porcelain);
  }

  & [role="option"].selected {
    background: var(--theme-color-masala);
    color: var(--theme-color-white);
  }

  /* this selector is required to override some * rules which interfere - so do not simplify */

  & ul[role="listbox"] {
    overflow-y: auto;
    position: relative;
  }

  & .noselect {
    -moz-user-select: none;
    -khtml-user-select: none;
    -webkit-user-select: none;
    -ms-user-select: none;
    user-select: none;
  }
}

</style>
