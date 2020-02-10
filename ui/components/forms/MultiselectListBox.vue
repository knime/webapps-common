<script>
let count = 0;
const KEY_DOWN = 40;
const KEY_UP = 38;
const KEY_HOME = 36;
const KEY_END = 35;
const KEY_SPACE = 32;
const KEY_ENTER = 13;

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
            selectedValues: this.value,
            optionLineHeight: 20
        };
    },
    computed: {
        ulSizeStyle() {
            return this.size > 0 ? { 'max-height': `${this.size * this.optionLineHeight}px` } : {};
        }
    },
    methods: {
        isCurrentValue(candidate) {
            return this.value.includes(candidate);
        },
        setSelected(value) {
            consola.trace('MultiselectListBox setSelected on', value);
            if (this.selectedValues.includes(value)) {
                this.selectedValues.splice(this.selectedValues.indexOf(value), 1);
            } else {
                this.selectedValues.push(value);
            }
            this.$emit('input', this.selectedValues);
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
            this.scrollToCurrent();
        },
        onArrowUp() {
            let next = this.currentKeyNavIndex - 1;
            if (next < 0) {
                return;
            }
            this.currentKeyNavIndex = next;
            this.scrollToCurrent();
        },
        onEndKey() {
            this.currentKeyNavIndex = this.possibleValues.length - 1;
            this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
        },
        onHomeKey() {
            this.currentKeyNavIndex = 0;
            this.$refs.ul.scrollTop = 0;
        },
        handleKeyDown(e)  {
            /* NOTE: we use a single keyDown method because @keydown.up bindings are not testable. */
            if (e.keyCode === KEY_DOWN) {
                this.onArrowDown();
                e.preventDefault();
            }
            if (e.keyCode === KEY_UP) {
                this.onArrowUp();
                e.preventDefault();
            }
            if (e.keyCode === KEY_END) {
                this.onEndKey();
                e.preventDefault();
            }
            if (e.keyCode === KEY_HOME) {
                this.onHomeKey();
                e.preventDefault();
            }
            if (e.keyCode === KEY_SPACE || e.keyCode === KEY_ENTER) {
                // do the selection
                this.setSelected(this.possibleValues[this.currentKeyNavIndex].id);
                e.preventDefault();
            }
        },
        hasSelection() {
            return this.selectedValues.length > 0;
        },
        getCurrentKeyNavItem() {
            try {
                return this.possibleValues[this.currentKeyNavIndex];
            } catch (e) {
                return { id: '', text: '' };
            }
        },
        generateOptionId(item) {
            if (!item) {
                return '';
            }
            let cleanId = item.id.replace(/[^\w]/gi, '');
            return `option-${this.id}-${cleanId}`;
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
      @keydown="handleKeyDown"
    >
      <li
        v-for="(item, index) of possibleValues"
        :id="generateOptionId(item)"
        :key="`listbox-${item.id}`"
        ref="options"
        role="option"
        :style="{ 'line-height': `${optionLineHeight}px` }"
        :class="{
          'selected': isCurrentValue(item.id),
          'hasKeyNavFocus' : currentKeyNavIndex === index,
          'noselect' :true
        }"
        :aria-selected="isCurrentValue(item.id)"
        @click="setSelected(item.id)"
        @focus="setSelected(item.id)"
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

ul:focus-within [role="option"].hasKeyNavFocus {
  /* TODO: decide how this style should be */
  font-weight: 500;
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
