<script lang="ts">
import { defineComponent, type PropType } from "vue";

let count = 0;

export type BaseRadioButtonItem = {
  id: string;
  text: string;
  icon: string;
  subtext?: string;
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
    bold: {
      type: Boolean,
      default: false,
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
          (item) =>
            item.hasOwnProperty("id") &&
            (item.hasOwnProperty("text") || item.hasOwnProperty("icon")),
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
    <label
      v-for="item of possibleValues"
      :key="`radio-${item.id}`"
      :class="{ 'with-subtext': item.subtext }"
    >
      <input
        ref="input"
        :checked="modelValue === item.id"
        :value="item.id"
        :name="inputName"
        :disabled="disabled || item.disabled"
        type="radio"
        @change="onInput"
      />
      <span v-if="item.icon" class="item-content">
        <Component :is="item.icon" />
      </span>
      <span v-else class="item-content" :title="item.text" :class="{ bold }">{{
        item.text
      }}</span>
      <slot :item="item" />
      <br v-if="item.subtext" /><span v-if="item.subtext">
        {{ item.subtext }}</span
      >
    </label>
  </div>
</template>

<style type="postcss" scoped>
label {
  display: flex;
}

.bold {
  font-weight: bold;
}

.with-subtext {
  margin-bottom: 30px;
}

svg {
  width: 18px;
  height: 18px;
  stroke-width: calc(32px / 18px);
  stroke: white;
}
</style>
