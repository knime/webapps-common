<script setup lang="ts">
import { computed } from "vue";

import { KdsRadioButton } from "@knime/kds-components";

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

const handleModelValueChange = (value: string) => {
  props.changeValue(value);
};
</script>

<template>
  <label
    v-for="item of options"
    :key="`radio-${item.id}`"
    class="radio-wrapper"
  >
    <KdsRadioButton
      class="radio-button"
      :model-value="control.data === item.id"
      :text="item.text"
      :disabled="disabled"
      @update:model-value="() => handleModelValueChange(item.id)"
    />
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
