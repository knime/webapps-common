<script>
export default {
  name: "Description",
  props: {
    /**
     * the text to be shown
     */
    text: {
      type: String,
      default: null,
    },
    /**
     * whether the provided `text` should be rendered as HTML or plain text
     */
    renderAsHtml: {
      type: Boolean,
      default: false,
    },
  },
};
</script>

<template>
  <div v-if="$slots.default" class="description">
    <!-- @slot if content is provided via slot, the `text` and `renderAsHtml` props will be ignored -->
    <slot />
  </div>
  <!-- eslint-disable vue/no-v-html -->
  <div
    v-else-if="!$slots.default && renderAsHtml"
    v-bind="{ ...$attrs }"
    class="description"
    v-html="text"
  />
  <div v-else class="description plain" v-text="text" />
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/rich-text-editor.css");

.description {
  --rich-text-editor-font-size: var(--description-font-size, 18px);

  line-height: 26px;
  overflow-wrap: anywhere;

  &.plain {
    white-space: pre-line;
  }

  &:deep() {
    @mixin rich-text-editor-styles;
  }
}
</style>
