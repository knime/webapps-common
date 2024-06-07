<script>
let labelForId = 0;
/**
 * Default label component
 * It provides a `labelForId` property that can be used via slot prop destructuring to associate it with a form element
 * like so:
 *
 * @example
 *   <Label #default="{ labelForId }">
 *     <input :id="labelForId">
 *   </Label>
 *
 * Now, the labelForId is guaranteed to be a unique id, and when the `label` HTML element's `for` attribute is the same
 * as the input's `id`.
 */
export default {
  inject: {
    largeLabels: {
      // provided e.g. by Fieldset.vue
      default: false,
    },
  },
  props: {
    generateId: {
      type: Boolean,
      default: true,
    },
    idPrefix: {
      type: String,
      default: "comp",
    },
    text: {
      default: "",
      type: String,
    },
    /**
     * smaller font size and margin
     */
    large: {
      type: Boolean,
      default: false,
    },
    /**
     * Whether to show the label or only its content.
     */
    active: {
      type: Boolean,
      default: true,
    },
  },
  emits: ["labelForId"],
  computed: {
    labelFor() {
      if (this.generateId) {
        return `${this.idPrefix}-${this.labelForId}`;
      }
      return null;
    },
    labelId() {
      if (this.generateId) {
        return `label-${this.labelFor}`;
      }
      return null;
    },
    isLarge() {
      return this.large || this.largeLabels;
    },
  },
  beforeCreate() {
    labelForId += 1;
    this.labelForId = labelForId;
  },
  mounted() {
    this.$emit("labelForId", this.labelFor);
  },
};
</script>

<template>
  <div class="label-wrapper">
    <label
      v-if="active"
      :id="labelId"
      :for="labelFor"
      :class="['label-text', { large: isLarge }]"
      v-text="text"
    />
    <slot :label-for-id="labelFor" />
  </div>
</template>

<style lang="postcss" scoped>
.label-wrapper {
  margin-top: 0;
}

.label-text {
  font-weight: 500;
  font-size: 13px;
  font-family: var(--theme-text-medium-font-family);
  color: var(--theme-text-medium-color);
  line-height: 18px;
  display: block;
  width: max-content;
  text-overflow: ellipsis;
  overflow: hidden;
  max-width: 100%;

  &.large {
    font-weight: 700;
    font-size: 16px;
    font-family: var(--theme-text-bold-font-family);
    color: var(--theme-text-bold-color);
    line-height: 20px;
    margin-bottom: 10px;
  }
}
</style>
