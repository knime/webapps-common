<script lang="ts" setup>
import { computed, ref, type WritableComputedRef } from "vue";
import PlusSmall from "@knime/styles/img/icons/plus-small.svg";
import MinusSmall from "@knime/styles/img/icons/minus-small.svg";
import FunctionButton from "../../Buttons/FunctionButton.vue";

type Props = {
  modelValue: number;
  step?: number;
  min?: number;
  max?: number;
  disabled?: boolean;
};

const props = withDefaults(defineProps<Props>(), {
  step: 1,
  min: -Infinity,
  max: Infinity,
  disabled: false,
});

const emit = defineEmits<{
  "update:modelValue": [value: number];
}>();

const numberField = ref<null | HTMLInputElement>(null);

const inputVal: WritableComputedRef<number> = computed({
  get: () => props.modelValue,
  set: (val) => {
    const number = Math.min(Math.max(val, props.min), props.max);
    emit("update:modelValue", number);
  },
});

const onIncrease = () => {
  numberField.value!.stepUp();
  inputVal.value = parseInt(numberField.value!.value, 10);
};

const onDecrease = () => {
  numberField.value!.stepDown();
  inputVal.value = parseInt(numberField.value!.value, 10);
};
</script>

<template>
  <div class="quantity-input">
    <FunctionButton
      :disabled="disabled || inputVal <= min"
      title="Decrease"
      @click="onDecrease"
    >
      <MinusSmall />
    </FunctionButton>

    <input
      ref="numberField"
      v-model.number="inputVal"
      type="number"
      :min="min"
      :max="max"
      :step="step"
      :disabled="disabled"
    />

    <FunctionButton
      :disabled="disabled || inputVal >= max"
      title="Increase"
      @click="onIncrease"
    >
      <PlusSmall />
    </FunctionButton>
  </div>
</template>

<style lang="postcss" scoped>
.quantity-input {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 8px;
  isolation: isolate;
  width: 100%;
  height: var(--single-line-form-height);

  & .function-button {
    flex: 0 0 30px;
  }

  & input {
    flex: 0 0 auto;
    font-size: 13px;
    font-weight: 300;
    text-align: center;
    height: 24px;
    padding: 0 10px;
    line-height: normal;
    border-radius: 0;
    min-width: 50px; /* prevent shrinking the input if the range is between 0 and 9999 */
    border: 1px solid var(--knime-stone-gray);
    outline: none;
    background-color: var(--theme-input-field-background-color);
    appearance: textfield; /* Hide native buttons in Firefox */

    /* Hide native buttons elsewhere */
    &::-webkit-outer-spin-button,
    &::-webkit-inner-spin-button {
      appearance: none;
      margin: 0; /* <-- Apparently some margin are still there even though it's hidden */
    }

    &:disabled {
      opacity: 0.5;
    }

    &:focus {
      border-color: var(--knime-cornflower);
      box-shadow: 0 0 0 1px var(--knime-cornflower);
    }

    &:hover:not(:focus, :disabled) {
      background-color: var(--theme-input-field-background-color-focus);
    }
  }
}
</style>
