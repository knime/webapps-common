<script>
import Checkbox from "../forms/Checkbox.vue";
export default {
  components: {
    Checkbox,
  },
  props: {
    /**
     * List of possible values. Each item must have an `id` and a `text` property.
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
        return values.every(
          (item) => item.hasOwnProperty("id") && item.hasOwnProperty("text"),
        );
      },
    },
    /**
     * Controls the alignment
     */
    alignment: {
      type: String,
      default: "horizontal",
      validator(value) {
        return ["horizontal", "vertical"].includes(value);
      },
    },
    disabled: {
      type: Boolean,
      default: false,
    },
    isValid: {
      default: true,
      type: Boolean,
    },
    /**
     * selected value (which is a list of ids of entries)
     */
    modelValue: {
      type: Array,
      default: () => [],
    },
  },
  emits: ["update:modelValue"],
  methods: {
    validate() {
      let isValid = !this.possibleValues.some((x) => x.invalid);
      return {
        isValid,
        errorMessage: isValid
          ? null
          : "One or more of the selected items is invalid.",
      };
    },
    onUpdateModelValue(value, toggled) {
      let checkedValue = Array.from(this.modelValue);
      if (toggled) {
        if (checkedValue.indexOf(value) === -1) {
          checkedValue.push(value);
        }
      } else {
        checkedValue = checkedValue.filter((x) => x !== value);
      }
      consola.trace("Checkboxes value changed to", checkedValue);

      /**
       * Fired when the selection changes.
       *
       * @event input
       * @type {Array}
       */
      this.$emit("update:modelValue", checkedValue);
    },
    /**
     * Is at least one checkbox checked?
     * @returns {boolean}
     */
    hasSelection() {
      return this.$refs.boxes.some((x) => x.isChecked());
    },
  },
};
</script>

<template>
  <div :class="['checkboxes', alignment]">
    <Checkbox
      v-for="item of possibleValues"
      ref="boxes"
      :key="`checkboxes-${item.id}`"
      :model-value="modelValue.indexOf(item.id) > -1"
      :title="item.text"
      :invalid="item.invalid"
      :disabled="disabled"
      class="box"
      @update:model-value="onUpdateModelValue(item.id, $event)"
    >
      {{ item.text }}
    </Checkbox>
  </div>
</template>

<style scoped lang="postcss">
.checkboxes {
  overflow: hidden;
  padding: 2px;

  &.horizontal {
    display: flex;
    flex-flow: row wrap;
    gap: var(--spacing-12) 0;

    & :deep(label) {
      text-overflow: ellipsis;

      &:not(:last-of-type) {
        margin-right: var(--spacing-12);
      }
    }
  }

  &.vertical:deep(label) {
    &:not(:last-of-type) {
      margin-bottom: var(--spacing-12);
    }
  }

  /* root of Checkbox which is a <label> */
  & .box {
    /* display block makes it vertical by default */
    display: block;
    width: max-content;
  }
}
</style>
