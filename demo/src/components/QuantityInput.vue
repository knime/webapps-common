<script setup>
import CodeExample from "./demo/CodeExample.vue";
import QuantityInput from "webapps-common/ui/components/forms/QuantityInput.vue";
import code from "webapps-common/ui/components/forms/QuantityInput.vue?raw";
import { ref } from "vue";

const codeExample = `<QuantityInput
  v-model="inputValue1"
  :min="min"
  :max="max"
  :step="1"
/>`;

/* eslint-disable no-magic-numbers */
const min = ref(-99);
const max = ref(99);
const inputValue1 = ref(2);
const inputValue2 = ref(3);
const inputValue3 = ref(5);
const inputValue4 = ref(7);
const step1 = ref(1);
const step2 = ref(10);
const step3 = ref(3);
/* eslint-enable no-magic-numbers */
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            Numeric input field with type integer to set a quantity with control
            over min and max values, as well as increment steps. Buttons allow
            the user to decrement or increment the value with the mouse or
            keyboard. It acts as a form element, so it emits
            <code>input</code> events and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-4">
          min: {{ min }}
          <br />
          max: {{ max }}
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <div class="grid-container no-wrap">
            <div class="grid-item-6">How many workflows (steps: 1)</div>
            <div class="grid-item-6">
              <QuantityInput
                v-model="inputValue1"
                :min="min"
                :max="max"
                :step="step1"
              />
            </div>
          </div>
          <div class="grid-container no-wrap">
            <div class="grid-item-6">How many nodes (steps: 10)</div>
            <div class="grid-item-6">
              <QuantityInput
                v-model="inputValue2"
                :min="min"
                :max="max"
                :step="step2"
              />
            </div>
          </div>
          <div class="grid-container no-wrap">
            <div class="grid-item-6">How many components (steps: 3)</div>
            <div class="grid-item-6">
              <QuantityInput
                v-model="inputValue3"
                :min="min"
                :max="max"
                :step="step3"
              />
            </div>
          </div>
          <div class="grid-container no-wrap">
            <div class="grid-item-6">How many collections</div>
            <div class="grid-item-6">
              <QuantityInput
                v-model="inputValue4"
                :min="min"
                :max="max"
                :step="step1"
                :disabled="true"
              />
            </div>
          </div>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-4">
          Quantity 1: {{ inputValue1 }}
          <br />
          Quantity 2: {{ inputValue2 }}
          <br />
          Quantity 3: {{ inputValue3 }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show NumberInput.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.no-wrap {
  padding-bottom: 0;
  flex-wrap: nowrap;

  & > div:first-child {
    line-height: var(--single-line-form-height);
  }
}
</style>
