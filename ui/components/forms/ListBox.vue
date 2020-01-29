<script>
let count = 0;
export default {
    props: {
        id: {
            type: String,
            default() {
                return `ListBox-${count++}`;
            }
        },
        value: {
            type: String,
            default: ''
        },
        /**
         * Controls the size of the label
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
            selectedIndex: 0,
            optionLineHeight: 1.8
        };
    },
    computed: {
        ulSizeStyle() {
            return this.size > 0 ? { 'max-height': `${this.size * this.optionLineHeight}em` } : {};
        }
    },
    mounted() {
        // update the selected index on start
        this.selectedIndex = this.possibleValues.map(x => x.id).indexOf(this.value);
    },
    methods: {
        isCurrentValue(candidate) {
            return this.value === candidate;
        },
        setSelected(value, index) {
            consola.trace('ListBox setSelected on', value);
            this.selectedIndex = index;
            this.$emit('input', value);
        },
        scrollToCurrent() {
            let listBoxNode = this.$refs.ul;
            if (listBoxNode.scrollHeight > listBoxNode.clientHeight) {
                let element = this.$refs.options[this.selectedIndex];
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
            let next = this.selectedIndex + 1;
            if (next >= this.possibleValues.length) {
                return;
            }
            this.setSelected(this.possibleValues[next].id, next);
            this.scrollToCurrent();
        },
        onArrowUp() {
            let next = this.selectedIndex - 1;
            if (next < 0) {
                return;
            }
            this.setSelected(this.possibleValues[next].id, next);
            this.scrollToCurrent();
        },
        onEndKey() {
            let next = this.possibleValues.length - 1;
            this.setSelected(this.possibleValues[next].id, next);
            this.$refs.ul.scrollTop = this.$refs.ul.scrollHeight;
        },
        onHomeKey() {
            let next = 0;
            this.setSelected(this.possibleValues[next].id, next);
            this.$refs.ul.scrollTop = 0;
        },
        hasSelection() {
            return this.selectedIndex >= 0;
        },
        getCurrentItem() {
            // does not use value as this might be something different set from outside but not part of possible values
            try {
                return this.possibleValues[this.selectedIndex];
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
      :aria-activedescendant="generateOptionId(getCurrentItem())"
      @keydown.down.prevent="onArrowDown"
      @keydown.up.prevent="onArrowUp"
      @keydown.end.prevent="onEndKey"
      @keydown.home.prevent="onHomeKey"
    >
      <li
        v-for="(item, index) of possibleValues"
        :id="generateOptionId(item)"
        :key="`listbox-${item.id}`"
        ref="options"
        role="option"
        :style="{ 'line-height': optionLineHeight }"
        :class="{ 'focused': isCurrentValue(item.id), 'noselect' : true }"
        :aria-selected="isCurrentValue(item.id)"
        @click="setSelected(item.id, index)"
        @focus="setSelected(item.id, index)"
      >
        {{ item.text }}
      </li>
    </ul>
  </div>
</template>

<style lang="postcss" scoped>
@import "webapps-common/ui/css/variables";

[role="listbox"] {
  min-height: 1.8em;
  padding: 0;
  margin: 0;
  background: var(--theme-color-white);
  border: 1px solid var(--theme-color-stone-gray);
}

[role="option"] {
  display: block;
  padding: 0 1em 0 1em;
  position: relative;
}

[role="option"]:hover {
  background: var(--theme-color-porcelain);
}

[role="option"].focused {
  background: var(--theme-color-masala);
  color: var(--theme-color-white);
}

ul[role="listbox"] {
  overflow-y: auto;
  position: relative;
}

ul:focus {
  outline: none;
  border-color: var(--theme-color-masala);
}

.noselect {
  -moz-user-select: none;
  -khtml-user-select: none;
  -webkit-user-select: none;
  -ms-user-select: none;
  user-select: none;
}

</style>
