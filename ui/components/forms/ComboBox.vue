<script>
import Multiselect from './Multiselect.vue';
import FunctionButton from '../FunctionButton.vue';
import CloseIcon from '../../assets/img/icons/close.svg';

export default {
    components: {
        Multiselect,
        FunctionButton,
        CloseIcon
    },
    props: {
        /**
         * List of possible values. Each item must have an `id` and a `text` property. Some optional properties
         * can be used that are specified in Multiselect.vue.
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
        },
        /**
         * List of initial selected ids.
         */
        initialSelectedIds: {
            type: Array,
            default: () => []
        },
        /**
         * Limit the number of visible options in the dropdown
         */
        sizeVisibleOptions: {
            type: Number,
            default: 5,
            validator(value) {
                return value >= 0;
            }
        }
    },
    emits: ['update:selectedIds'],
    data() {
        return {
            selectedIds: this.initialSelectedIds,
            /*
             * Multiselect behavior: options close on clickaway except when focussing specific multiselect elements
             * When the input/removeAllTags-Button of this component is focussed then they shouldn't be closed either,
             * which is why the need to be passed to the Multiselect component
             */
            focusElements: [],
            searchValue: '',
            inputFocussed: false
        };
    },
    computed: {
        filteredValues() {
            return this.possibleValues.filter(value => value.id.includes(this.searchValue));
        },
        hasSelection() {
            return this.selectedValues.length > 0;
        },
        inputWidth() {
            return this.inputFocussed && this.filteredValues.length > 0 ? {} : { width: '0%' };
        },
        selectedValues() {
            return this.selectedIds.length === 0
                ? []
                : this.possibleValues.filter(ele => this.selectedIds.includes(ele.id));
        },
        maxSizeVisibleOptions() {
            return this.filteredValues.length < this.sizeVisibleOptions
                ? this.filteredValues.length
                : this.sizeVisibleOptions;
        }
    },
    watch: {
        hasSelection() {
            this.setFocusElements();
        }
    },
    mounted() {
        this.setFocusElements();
    },
    methods: {
        focusInput() {
            this.$refs.searchInput.focus();
        },
        onInputFocus() {
            if (!this.inputFocussed) {
                this.$refs.multiselect.toggle();
            }
            this.inputFocussed = true;
            this.$refs.multiselect.updateFocusOptions();
        },
        onFocusOutside() {
            this.inputFocussed = false;
            this.searchValue = '';
        },
        setFocusElements() {
            this.focusElements = this.hasSelection
                ? [this.$refs.searchInput,
                    this.$refs.removeAllTags.$el && this.$refs.removeAllTags.$el.nextElementSibling]
                : [this.$refs.searchInput];
        },
        updateSelectedIds(selectedIds) {
            this.selectedIds = selectedIds;
            this.$emit('update:selectedIds', this.selectedIds);
        },
        onDown() {
            this.$refs.multiselect.onDown();
        },
        removeTag(idToRemove) {
            this.updateSelectedIds(this.selectedIds.filter(id => id !== idToRemove));
        },
        removeAllTags() {
            this.updateSelectedIds([]);
            this.focusInput();
        },
        onInput() {
            this.$refs.multiselect.updateFocusOptions();
        },
        onInputEscape() {
            this.$refs.listBox.focus();
        }
    }
};
</script>

<template>
  <Multiselect
    ref="multiselect"
    :model-value="selectedIds"
    :possible-values="filteredValues"
    use-custom-list-box
    :size-visible-options="maxSizeVisibleOptions"
    :parent-focus-elements="focusElements"
    @focus-outside="onFocusOutside"
    @update:model-value="updateSelectedIds"
  >
    <template #listBox>
      <div
        ref="listBox"
        class="summary-input-icon-wrapper"
        tabindex="0"
        @keydown.enter.prevent.self="focusInput"
      >
        <div
          :class="['summary-input-wrapper', {'with-icon-right': hasSelection}]"
          @click.stop="focusInput"
        >
          <div
            v-for="item, index in selectedValues"
            :key="`item.id${index}`"
            class="tag"
            :title="item.text"
          >
            <span class="text">{{ item.text }}</span>
            <FunctionButton
              class="remove-tag-button"
              @click.stop="removeTag(item.id)"
            >
              <CloseIcon class="remove-tag-button-icon" />
            </FunctionButton>
          </div>
          <input
            ref="searchInput"
            v-model="searchValue"
            class="search-input"
            type="text"
            :style="inputWidth"
            @focus="onInputFocus"
            @input="onInput"
            @keydown.down.stop.prevent="onDown"
            @keydown.esc.stop.prevent="onInputEscape"
          >
        </div>
        <div
          v-show="hasSelection"
          class="icon-right"
        >
          <FunctionButton
            ref="removeAllTags"
            class="remove-all-tags-button"
            @click.stop="removeAllTags"
          >
            <CloseIcon />
          </FunctionButton>
        </div>
      </div>
    </template>
  </Multiselect>
</template>

<style lang="postcss" scoped>
.multiselect {
  border: 1px solid var(--knime-dove-gray);

  &:focus-within {
    border-color: var(--knime-masala);
  }

  & .summary-input-icon-wrapper {
    display: flex;
    justify-content: space-between;
    max-width: 100%;

    &:focus {
      outline: none;
    }

    & .summary-input-wrapper {
      max-width: 100%;
      padding: 11px;
      cursor: text;
      display: flex;
      flex-wrap: wrap;
      gap: 5px;
      flex: 1;

      &.with-icon-right {
        max-width: calc(100% - 40px);
        padding: 11px 0 11px 11px;
      }

      & .search-input {
        all: unset;
        height: 18px;
        font-size: 13px;
        font-weight: 300;
        line-height: normal;
        flex: 1
      }

      & .tag {
        height: 18px;
        max-width: 100%;
        overflow: hidden;
        padding: 2px 2px 2px 5px;
        gap: 2px;
        display: flex;
        align-items: center;
        cursor: default;
        border: 1px solid var(--knime-dove-gray);

        & .text {
          font-weight: 500;
          font-size: 12px;
          color: var(--knime-dove-gray);
          overflow: hidden;
          white-space: nowrap;
          text-overflow: ellipsis;
          line-height: 12px;
        }

        & .remove-tag-button {
          padding: 2px;
          
          & :deep(svg) {
            --icon-size: 10;

            width: calc(var(--icon-size) * 1px);
            height: calc(var(--icon-size) * 1px);
            stroke-width: calc(32px / var(--icon-size));
           }
        }
      }
    }

    & .icon-right {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }
}
</style>
