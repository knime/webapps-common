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
        initialSelectedIds: {
            type: Array,
            default: () => []
        },
        size: {
            type: Number,
            default: 0,
            validator(value) {
                return value >= 0;
            }
        }
    },
    emits: ['update:selectedIds'],
    data() {
        return {
            selectedIds: this.initialSelectedIds,
            searchValue: '',
            inputFocussed: false,
            componentMounted: false
        };
    },
    computed: {
        filteredValues() {
            return this.searchValue === ''
                ? []
                : this.possibleValues.filter(value => value.id.includes(this.searchValue));
        },
        hasRemoveAllTagsIcon() {
            return this.selectedValues.length > 1;
        },
        inputWidth() {
            return this.inputFocussed && this.filteredValues.length > 0 ? {} : { width: '0%' };
        },
        selectedValues() {
            return this.selectedIds.length === 0
                ? []
                : this.possibleValues.filter(ele => this.selectedIds.includes(ele.id));
        },
        focusElements() {
            if (this.componentMounted) {
                if (this.hasRemoveAllTagsIcon) {
                    return [this.$refs.searchInput,
                        this.$refs.removeAllTags.$el && this.$refs.removeAllTags.$el.nextElementSibling];
                }
                return [this.$refs.searchInput];
            }
            return [];
        }
    },
    mounted() {
        this.componentMounted = true;
    },
    methods: {
        onFocusOutside() {
            this.inputFocussed = false;
            this.searchValue = '';
        },
        focusInput() {
            this.$refs.searchInput.focus();
            this.inputFocussed = true;
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
        async onInput() {
            await this.$nextTick(); // wait for until new values in dropdown of the child are rendered
            this.$refs.multiselect.updateFocusOptions();
        }
    }
};
</script>

<template>
  <Multiselect
    ref="multiselect"
    :model-value="selectedIds"
    :possible-values="filteredValues"
    use-custom-summary
    :size="size"
    :parent-focus-elements="focusElements"
    @focus-outside="onFocusOutside"
    @update:model-value="updateSelectedIds"
  >
    <template #summary>
      <div
        class="summary-input-icon-wrapper"
        tabindex="0"
        @keydown.enter.prevent.self="focusInput"
      >
        <div
          :class="['summary-input-wrapper', {'with-icon-right': hasRemoveAllTagsIcon}]"
          @click.stop="focusInput"
        >
          <div
            v-for="item, index in selectedValues"
            :key="`item.id${index}`"
            class="tag"
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
            @input="onInput"
            @keydown.down.stop.prevent="onDown"
          >
        </div>
        <div
          v-show="hasRemoveAllTagsIcon"
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
          
        }

        & .remove-tag-button {
          padding: 2px;

          & .remove-tag-button-icon {
            width: 10px;
            height: 10px;
            cursor: pointer;
          }
        }
      }
    }

    & .icon-right {
      width: 40px;
      display: flex;
      align-items: center;
      justify-content: center;

      & .remove-all-tags-button {
        --icon-size: 12;

        & :deep(svg) {
          width: calc(var(--icon-size) * 1px);
          height: calc(var(--icon-size) * 1px);
          stroke-width: calc(32px / var(--icon-size));
        }
      }
    }
  }
}
</style>
