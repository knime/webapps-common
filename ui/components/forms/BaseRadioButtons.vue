<script lang="ts">
import { defineComponent, type PropType } from "vue";

let count = 0;

export type BaseRadioButtonItem = {
  id: string;
  text: string;
  disabled?: boolean;
};

export default defineComponent({
  props: {
    id: {
      type: String,
      default: null,
    },
    modelValue: {
      type: String,
      default: null,
    },
    name: {
      type: String,
      default: null,
    },
    disabled: {
      default: false,
      type: Boolean,
    },
    possibleValues: {
      type: Array as PropType<Array<BaseRadioButtonItem>>,
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
  },
  emits: ["update:modelValue"],
  computed: {
    inputName() {
      // @ts-expect-error
      return this.name || `wc-radio-${this.count}`;
    },
  },
  beforeCreate() {
    count += 1;
    // @ts-expect-error
    this.count = count;
  },
  methods: {
    onInput($event: Event) {
      // eslint-disable-next-line no-extra-parens
      const value = ($event.target as HTMLInputElement).value;

      /**
       * Fired when the radio button value changes.
       */
      this.$emit("update:modelValue", value);
    },
  },
});
</script>

<template>
  <div :id="id" role="radiogroup">
    <label v-for="item of possibleValues" :key="`radio-${item.id}`">
      <input
        ref="input"
        :checked="modelValue === item.id"
        :value="item.id"
        :name="inputName"
        :disabled="disabled || item.disabled"
        type="radio"
        @change="onInput"
      />
      <span :title="item.text">{{ item.text }}</span>
      <slot :item="item" />
    </label>
  </div>
</template>

<style type="postcss" scoped>
label {
  display: flex;
}
</style>
