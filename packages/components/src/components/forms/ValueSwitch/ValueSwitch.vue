<script lang="ts">
import { type PropType, defineComponent } from "vue";

import BaseRadioButtons, {
  type BaseRadioButtonItem,
} from "../RadioButtons/BaseRadioButtons.vue";

// renamed and re-exported to prevent exposing BaseRadioButton's type.
// also, if we want to add custom properties to the ValueSwitch's type, we can do so here
export type ValueSwitchItem = BaseRadioButtonItem;

export default defineComponent({
  name: "ValueSwitch",
  components: {
    BaseRadioButtons,
  },
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
      type: Array as PropType<Array<ValueSwitchItem>>,
      default: () => [],
    },
    compact: {
      type: Boolean,
      default: false,
    },
  },
  emits: ["update:modelValue"],
});
</script>

<template>
  <BaseRadioButtons
    :id="id"
    ref="radioButton"
    :possible-values="possibleValues"
    :model-value="modelValue"
    :name="name"
    :disabled="disabled"
    class="value-switch"
    :class="{
      disabled,
      compact: compact,
      normal: !compact,
    }"
    @update:model-value="$emit('update:modelValue', $event)"
  >
    <template #default="slotProps">
      <slot v-bind="slotProps" />
    </template>
  </BaseRadioButtons>
</template>

<style lang="postcss" scoped>
.value-switch {
  --border-radius: 50px;

  display: flex;
  align-items: center;
  border: 1px solid var(--theme-value-switch-border-color);
  border-radius: var(--border-radius);
  width: max-content;
  height: calc(var(--wrapper-height) * 1px);

  & :deep(span) {
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    border-radius: var(--border-radius);
    min-width: 41px;
    padding: 0 10px;
    font-weight: 300;
    font-size: 13px;
    line-height: 20px;
    height: calc(var(--wrapper-height) * 1px);
  }

  &.disabled {
    opacity: 0.5;
  }

  &:focus-within {
    border-color: var(--theme-value-switch-border-color-focus);
  }

  &.normal {
    --wrapper-height: 30;
  }

  &.compact {
    --wrapper-height: 20;
  }

  & :deep(input[disabled]) + span {
    opacity: 0.5;
    pointer-events: none;
  }

  & :deep(input) {
    opacity: 0;
    position: absolute;
    width: 0;
    height: 0;

    & + span:hover {
      background-color: var(--theme-value-switch-background-color-hover);
    }

    &:checked + span {
      background-color: var(--theme-value-switch-background-color-checked);
      color: var(--theme-value-switch-background-color);
      pointer-events: none;
    }
  }
}
</style>
