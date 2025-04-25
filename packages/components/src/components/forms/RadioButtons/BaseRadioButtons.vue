<script lang="ts">
import { type PropType, defineComponent } from "vue";
import { useId } from "vue";

export type BaseRadioButtonItem = {
  id: string;
  text: string;
  subtext?: string;
  disabled?: boolean;
};

export default defineComponent({
  name: "BaseRadioButtons",
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
      default() {
        return `RadioButtons-${useId()}`;
      },
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
  methods: {
    onInput($event: Event) {
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
    <label
      v-for="item of possibleValues"
      :key="`radio-${item.id}`"
      :class="{ disabled: disabled || item.disabled }"
    >
      <input
        ref="input"
        :checked="modelValue === item.id"
        :value="item.id"
        :name="name"
        :disabled="disabled || item.disabled"
        type="radio"
        @change="onInput"
      />
      <span :title="item.text">{{ item.text }}</span>
      <slot :item="item" />
      <template v-if="item.subtext">
        <br /><span> {{ item.subtext }}</span>
      </template>
    </label>
  </div>
</template>

<style type="postcss" scoped>
label {
  display: flex;
  margin: var(--radio-button-margin, 0);
}
</style>
