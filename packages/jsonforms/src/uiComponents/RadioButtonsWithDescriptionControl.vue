<script setup lang="ts">
import { computed } from "vue";

import type { VueControlProps } from "../higherOrderComponents";

interface Option {
  const: string;
  title: string;
  description: string;
  price: string;
}

const props = defineProps<VueControlProps<string>>();

const options = computed(() => {
  const oneOf = props.control.schema.oneOf as Option[];
  return (
    oneOf?.map(({ const: id, title: text, price, description }) => ({
      id,
      text,
      price,
      description,
    })) || []
  );
});

const disabled = computed(() => !props.control.enabled);
const footnote = computed(
  () => props.control.uischema.options?.footnote || null,
);

const onChange = (event: InputEvent) => {
  props.handleChange(
    props.control.path,
    (event.target as HTMLInputElement)?.value,
  );
};
</script>

<template>
  <label
    v-for="item of options"
    :key="`radio-${item.id}`"
    class="radio-wrapper"
  >
    <div class="radio-button">
      <input
        :checked="control.data === item.id"
        :value="item.id"
        :name="`jsonforms-radio-${item.id}`"
        :disabled="disabled"
        type="radio"
        @input="onChange"
      />
      <div class="control">
        <svg
          v-if="control.data === item.id"
          class="dot"
          viewBox="0 0 2 2"
          aria-hidden="true"
          focusable="false"
        >
          <circle cx="1" cy="1" r="1" />
        </svg>
      </div>
      <span class="radio-title" :title="item.text">{{ item.text }}</span>
    </div>
    <!-- eslint-disable vue/no-v-html -->
    <div class="description" v-html="item.description" />
    <div
      :class="['price', { selected: control.data === item.id }]"
      v-html="item.price"
    />
  </label>
  <div v-if="footnote" class="footnote" v-html="footnote" />
  <!-- eslint-enable vue/no-v-html -->
</template>

<style lang="postcss">
.radio-wrapper {
  display: flex;
  flex-direction: row;
  gap: 20px;

  & .radio-button {
    position: relative;
    flex: 0 0 90px;

    & input[type="radio"] {
      position: absolute;
      opacity: 0;

      & ~ .radio-title {
        margin-left: 24px;
        font: var(--kds-font-base-title-small);
      }

      /* ◯ */
      & + .control {
        position: absolute;
        top: 3px;
        width: var(--kds-dimension-component-height-0-88x);
        height: var(--kds-dimension-component-height-0-88x);
        background: var(--kds-color-background-input-initial);
        border: var(--kds-border-action-input);
        border-radius: 50%;

        & .dot {
          display: block;
          flex-shrink: 0;
          width: 100%;
          height: 100%;

          & circle {
            fill: var(--kds-color-text-and-icon-selected);
            transform: scale(0.5);
            transform-origin: center;
            transform-box: fill-box;
          }
        }
      }

      &:enabled:hover + .control {
        cursor: pointer;
        background: var(--kds-color-background-input-hover);
      }

      &:checked {
        /* 🔘 */
        /* stylelint-disable no-descending-specificity */
        & + .control {
          background: var(--kds-color-background-selected-initial);
          border: var(--kds-border-action-selected);
        }
        /* stylelint-enable no-descending-specificity */

        &:enabled:hover + .control {
          background: var(--kds-color-background-selected-hover);
          border: var(--kds-border-action-selected);
        }
      }
    }
  }

  & .description,
  & .price {
    font: var(--kds-font-base-body-small);
  }

  & .description {
    flex: 1 1 auto;
  }

  & .price {
    flex: 0 0 110px;

    &.selected {
      font-weight: 500;
    }
  }
}

.footnote {
  font: var(--kds-font-base-body-small);
}
</style>
