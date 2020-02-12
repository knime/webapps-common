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
            currentKeyNavIndex: 0,
            lastClickIndex: -1,
            lastShiftDirection: '',
            selectedValues: this.value,
            dragging: false,
            draggingStartIndex: -1,
            optionLineHeight: 20
        };
    },
    computed: {
        ulSizeStyle() {
            return this.size > 0 ? { 'max-height': `${this.size * this.optionLineHeight}px` } : {};
        }
    },
    mounted() {
        window.addEventListener('mouseup', this.stopDrag);
    },
    methods: {
        isCurrentValue(candidate) {
            return this.value.includes(candidate);
        },
        handleCtrlClick(value, index) {
            this.currentKeyNavIndex = index;
            this.lastClickIndex = index;
            this.toggleSelection(value);
        },
        handleShiftClick(value, index) {
            this.currentKeyNavIndex = index;
            let values = [];
            let lastClickIndex = this.lastClickIndex;
            if (this.lastClickIndex !== -1) {
                if (index > lastClickIndex) {
                    for (let i = lastClickIndex; i <= index; i++) {
                        values.push(this.possibleValues[i].id);
                    }
                } else {
                    for (let i = index; i <= lastClickIndex; i++) {
                        values.push(this.possibleValues[i].id);
                    }
                }
            }
            this.setSelected(values);
            this.lastClickIndex = index;
        },
        startDrag(e) {
            this.dragging = true;
            this.draggingStartIndex = Number(e.target.getAttribute('data-option-index'));
        },
        onDrag(e) {
            if (this.dragging) {
                let dataIndex = e.target.getAttribute('data-option-index');
                if (!dataIndex) {
                    return;
                }
                let index = Number(dataIndex);
                let start = this.draggingStartIndex > index ? index : this.draggingStartIndex;
                let end = this.draggingStartIndex > index ? this.draggingStartIndex : index;
                this.setSelected(this.possibleValues.slice(start, end + 1).map(x => x.id));
            }
        },
        stopDrag(e) {
            this.dragging = false;
            this.draggingStartIndex = -1;
        },
        handleClick(value, index) {
            if (!this.multiselectByClick) {
                this.selectedValues = [];
            }
            this.currentKeyNavIndex = index;
            this.lastClickIndex = index;
            this.toggleSelection(value);
        },
        handleDblClick(id, index) {
            this.$emit('doubleClickOnItem', id, index);
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
        setSelected(values) {
            consola.trace('MultiselectListBox setSelected on', values);
            this.selectedValues = values;
            this.$emit('input', values);
        },
        setSelectedToCurrentKeyIndex() {
            let item = this.possibleValues[this.currentKeyNavIndex];
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
            this.currentKeyNavIndex = next;
            this.setSelectedToCurrentKeyIndex();
            this.scrollToCurrent();
        },
        onArrowUp() {
            let next = this.currentKeyNavIndex - 1;
            if (next < 0) {
                return;
            }
            this.currentKeyNavIndex = next;
            this.setSelectedToCurrentKeyIndex();
            this.scrollToCurrent();
        },
        onArrowDownShift() {
            let hasMultipleSelected = this.selectedValues.length > 1;
            let next = this.currentKeyNavIndex + (this.lastShiftDirection === 'up' && hasMultipleSelected ? 0 : 1);
            this.lastShiftDirection = 'down';
            if (next >= this.possibleValues.length) {
                return;
            }
            this.currentKeyNavIndex = next;
            this.toggleSelection(this.possibleValues[next].id);
            this.scrollToCurrent();
        },
        onArrowUpShift() {
            let hasMultipleSelected = this.selectedValues.length > 1;
            let next = this.currentKeyNavIndex - (this.lastShiftDirection === 'down' && hasMultipleSelected ? 0 : 1);
            this.lastShiftDirection = 'up';
            if (next < 0) {
                return;
            }
            this.currentKeyNavIndex = next;
            this.toggleSelection(this.possibleValues[next].id);
            this.scrollToCurrent();
        },
        onEndKey() {
            let next = this.possibleValues.length - 1;
            this.currentKeyNavIndex = next;
            this.shiftStartKeyNavIndex = next;
            this.setSelectedToCurrentKeyIndex();
            this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
        },
        onHomeKey() {
            let next = 0;
            this.currentKeyNavIndex = next;
            this.shiftStartKeyNavIndex = next;
            this.setSelectedToCurrentKeyIndex();
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
            this.selectedValues = this.possibleValues.map(x => x.id);
            this.$emit('input', this.selectedValues);
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
        }
    }
};
</script>

<template>
  <div>
    <ul
      ref="ul"
      role="listbox"
      tabindex="0"
      :aria-label="ariaLabel"
      :style="ulSizeStyle"
      :aria-activedescendant="generateOptionId(getCurrentKeyNavItem())"
      @keydown.ctrl.a.prevent.exact="selectAll"
      @keydown.up.prevent.exact="onArrowUp"
      @keydown.down.prevent.exact="onArrowDown"
      @keydown.shift.up.prevent.exact="onArrowUpShift"
      @keydown.shift.down.prevent.exact="onArrowDownShift"
      @keydown.left.prevent.exact="onArrowLeft"
      @keydown.right.prevent.exact="onArrowRight"
      @keydown.end.prevent.exact="onEndKey"
      @keydown.home.prevent.exact="onHomeKey"
      @keydown.space.prevent.exact="onHomeKey"
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
        @click.exact="handleClick(item.id, index)"
        @click.ctrl="handleCtrlClick(item.id, index)"
        @click.shift="handleShiftClick(item.id, index)"
        @dblclick="handleDblClick(item.id, index)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

[role="listbox"] {
  font-size: 14px;
  min-height: 20px;
  padding: 0;
  margin: 0;
  background: var(--theme-color-white);
  border: 1px solid var(--theme-color-stone-gray);
}

[role="listbox"]:focus {
  outline: none;
  border-color: var(--theme-color-masala);
}

[role="option"] {
  display: block;
  padding: 0 10px 0 10px;
  position: relative;
}

[role="option"]:hover {
  background: var(--theme-color-porcelain);
}

[role="option"].selected {
  background: var(--theme-color-masala);
  color: var(--theme-color-white);
}

/* this selector is required to override some * rules which interfere - so do not simplify */
ul[role="listbox"] {
  overflow-y: auto;
  position: relative;
}

.noselect {
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

</style>
