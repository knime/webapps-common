<script>
import { v4 as uuidv4 } from "uuid";
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
  name: "Label",
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
  data() {
    return {
      labelForId: uuidv4(),
    };
  },
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
  display: block;
  width: max-content;
  max-width: 100%;
  margin-bottom: 3px;
  overflow: hidden;
  text-overflow: ellipsis;
  font-family: var(--theme-text-medium-font-family);
  font-size: 13px;
  font-weight: 500;
  line-height: 18px;
  color: var(--theme-text-medium-color);

  &.large {
    margin-bottom: 10px;
    font-family: var(--theme-text-bold-font-family);
    font-size: 16px;
    font-weight: 700;
    line-height: 20px;
    color: var(--theme-text-bold-color);
  }
}
</style>
