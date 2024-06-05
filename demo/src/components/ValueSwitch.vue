<script lang="ts">
import { defineComponent } from "vue";

import ValueSwitch from "webapps-common/ui/components/forms/ValueSwitch.vue";
import Label from "webapps-common/ui/components/forms/Label.vue";
import code from "webapps-common/ui/components/forms/ValueSwitch.vue?raw";

import CodeExample from "./demo/CodeExample.vue";

const codeExample = `<ValueSwitch
  v-model="selected"
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD' },
    { id: 'cad', text: 'CAD' }
  ]"
/>
<ValueSwitch
  v-model="selected"
  compact
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD' },
    { id: 'cad', text: 'CAD' }
  ]"
/>
<ValueSwitch
  v-model="selected"
  disabled
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD' },
    { id: 'cad', text: 'CAD' }
  ]"
/>
<ValueSwitch
  v-model="selected"
  :possible-values="[
    { id: 'eur', text: 'EUR' },
    { id: 'usd', text: 'USD', disabled: true },
    { id: 'cad', text: 'CAD' }
  ]"
/>
`;

export default defineComponent({
  components: {
    ValueSwitch,
    Label,
    CodeExample,
  },
  data() {
    return {
      codeExample,

      selectedCurrency: "eur",
      currencies: [
        { id: "eur", text: "EUR" },
        { id: "usd", text: "USD" },
        { id: "cad", text: "CAD" },
      ],
    };
  },
  computed: {
    code() {
      return code;
    },

    withDisabledItem() {
      return this.currencies.map((currency) =>
        currency.id === "usd" ? { ...currency, disabled: true } : currency,
      );
    },
  },
});
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            A list of choices the user must choose one of. It emits an
            <code>input</code> event when something is selected, and it has a
            <code>value</code>.
          </p>
        </div>
      </div>

      <div class="grid-container">
        <div class="grid-item-4">
          <Label #default="{ labelForId }" text="Normal mode">
            <ValueSwitch
              :id="labelForId"
              v-model="selectedCurrency"
              :possible-values="currencies"
            />
          </Label>
        </div>
        <div class="grid-item-4">
          <Label #default="{ labelForId }" text="Compact mode">
            <ValueSwitch
              :id="labelForId"
              v-model="selectedCurrency"
              compact
              :possible-values="currencies"
            />
          </Label>
        </div>
        <div class="grid-item-4">selected id: {{ selectedCurrency }}</div>
      </div>

      <div class="grid-container">
        <div class="grid-item-4">
          <Label #default="{ labelForId }" text="Completely disabled">
            <ValueSwitch
              :id="labelForId"
              v-model="selectedCurrency"
              disabled
              :possible-values="currencies"
            />
          </Label>
        </div>
        <div class="grid-item-4">
          <Label #default="{ labelForId }" text="With single disabled option">
            <ValueSwitch
              :id="labelForId"
              v-model="selectedCurrency"
              :possible-values="withDisabledItem"
            />
          </Label>
        </div>
        <div class="grid-item-4" />
      </div>
    </section>

    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show ValueSwitch.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss">
.grid-container {
  padding-bottom: 15px;
}

.grid-item-4 {
  display: flex;
  flex-direction: column;
  justify-content: center;
}
</style>
