<script setup lang="ts">
import Tag from "./Tag.vue";
import { difference } from "lodash-es";
import { nextTick, ref, computed, toRef, watch } from "vue";

const defaultInitialTagCount = 5;

interface Props {
  /**
   * Maximum number of tags to display initially.
   * If more tags are present, they will be expandable via a '+' button.
   */
  numberOfInitialTags?: number;
  /**
   * List of tags (Strings) to display.
   * @type Array<String>
   */
  tags?: string[];
  /**
   * List of active tags (Strings) to display.
   * @type Array<String>
   */
  activeTags?: string[];
  /**
   * If the tags should emit events and have hover + cursor styles.
   */
  clickable?: boolean;
  /**
   * Show all tags optional v-model
   */
  showAll?: boolean;
  /**
   * Shows active tags in front of all others
   */
  sortByActive?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  numberOfInitialTags: defaultInitialTagCount,
  tags: () => [],
  activeTags: () => [],
  clickable: false,
  showAll: false,
  sortByActive: false,
});

type Emits = {
  click: [tag: string];
  "update:showAll": [showAll: boolean];
};

const emit = defineEmits<Emits>();

const displayAll = ref(false);

watch(toRef(props, "showAll"), (showAll) => {
  displayAll.value = showAll;
});

const mappedTags = computed(() => {
  const { tags, sortByActive, activeTags } = props;

  if (sortByActive) {
    return [
      ...activeTags.map((tag) => ({ name: tag, isActive: true })),
      ...difference(tags, activeTags).map((tag) => ({
        name: tag,
        isActive: false,
      })),
    ];
  }

  return tags.map((tag) => ({
    isActive: activeTags.includes(tag),
    name: tag,
  }));
});

const tagsToDisplay = computed(() =>
  displayAll.value
    ? mappedTags.value
    : mappedTags.value.slice(0, props.numberOfInitialTags),
);

const hasMoreTags = computed(() => {
  return !displayAll.value && props.tags.length > props.numberOfInitialTags;
});

const onClick = (tag: string) => {
  if (props.clickable) {
    emit("click", tag);
  }
};

const tagInstances = ref<InstanceType<typeof Tag>[]>();

const onShowMore = async (nextTagIndex: number) => {
  displayAll.value = true;
  emit("update:showAll", true);
  // this assumes we get more items and puts the focus on the next one
  await nextTick();
  tagInstances.value?.[nextTagIndex]?.$el.focus();
};
</script>

<template>
  <div v-if="tags.length" class="wrapper">
    <Tag
      v-for="(tag, index) in tagsToDisplay"
      ref="tagInstances"
      :key="index"
      :active="tag.isActive"
      :clickable="clickable"
      @click.prevent="onClick(tag.name)"
      @keydown.enter.stop.prevent="onClick(tag.name)"
    >
      {{ tag.name }}
      <slot name="icon" /> </Tag
    ><!-- no whitespace
    --><Tag
      v-if="hasMoreTags"
      class="more-tags"
      clickable
      @click.prevent.stop="onShowMore(tagsToDisplay.length)"
      @keydown.enter.stop.prevent="onShowMore(tagsToDisplay.length)"
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
</style>
