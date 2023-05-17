<script>
import Tag from './Tag.vue';

const defaultInitialTagCount = 5;

export default {
    components: {
        Tag
    },
    props: {
    /**
     * Maximum number of tags to display initially.
     * If more tags are present, they will be expandable via a '+' button.
     */
        numberOfInitialTags: {
            type: Number,
            default: defaultInitialTagCount
        },
        props: {
        /**
         * Maximum number of tags to display initially.
         * If more tags are present, they will be expandable via a '+' button.
         */
            numberOfInitialTags: {
                type: Number,
                default: defaultInitialTagCount
            },
            /**
         * List of tags (Strings) to display.
         * @type Array<String>
         */
            tags: {
                type: Array,
                default: () => []
            },
            /**
         * List of active tags (Strings) to display.
         * @type Array<String>
         */
            activeTags: {
                type: Array,
                default: () => []
            },
            /**
         * If the tags should emit events and have hover + cursor styles.
         */
            clickable: {
                type: Boolean,
                default: false
            }
        },
        /**
     * If the tags should emit events and have hover + cursor styles.
     */
        clickable: {
            type: Boolean,
            default: false
        },
        computed: {
            tagsToDisplay() {
                let displayTags = this.tags;
                if (!this.displayAll) {
                    displayTags = this.tags.slice(0, this.numberOfInitialTags);
                }
                return displayTags.map(tag => ({
                    isActive: this.activeTags.includes(tag),
                    name: tag
                }));
            },
            hasMoreTags() {
                return !this.displayAll && this.tags.length > this.numberOfInitialTags;
            }
        },
        hasMoreTags() {
            return !this.displayAll && this.tags.length > this.numberOfInitialTags;
        }
    },
    methods: {
        onClick(tag) {
            if (this.clickable) {
                this.$emit('click', tag);
            }
        },
        onShowMore() {
            this.displayAll = true;
        }
    }
};
</script>

<template>
  <div
    v-if="tags.length"
    class="wrapper"
  >
    <Tag
      v-for="(tag, index) in tagsToDisplay"
      :key="index"
      :active="tag.isActive"
      :clickable="clickable"
      @click.prevent="onClick(tag.name)"
    >
      {{ tag.name }}
      <slot name="icon" />
    </Tag><!-- no whitespace
    --><Tag
    v-if="hasMoreTags"
    class="more-tags"
    @click.prevent="onShowMore"
    >
      +{{ tags.length - numberOfInitialTags }}
    </Tag>
  </div>
</template>

<style lang="postcss" scoped>
.wrapper {
  display: flex;
  flex-wrap: wrap;
}

.more-tags {
  cursor: pointer;
}
</style>
