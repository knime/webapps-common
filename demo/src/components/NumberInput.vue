<script>
import CodeExample from './demo/CodeExample.vue';
import NumberInput from 'webapps-common/ui/components/forms/NumberInput.vue';
import Label from 'webapps-common/ui/components/forms/Label.vue';
import code from 'webapps-common/ui/components/forms/NumberInput.vue?raw';

const codeExample = `<NumberInput
  v-model="inputValue1"
  :min="min"
  :max="max"
  :is-valid="isValid1"
  type="integer"
  title="I am the integer"
  @input="validate1"
/>
<NumberInput
  v-model="inputValue2"
  :min="min"
  :max="max"
  :is-valid="isValid2"
  type="double"
  title="I am the double"
  @input="validate2"
/>
<NumberInput
  v-model="inputValue3"
  :min="min"
  :max="max"
  :is-valid="isValid3"
  type="integer"
  title="My starting value is invalid"
  @input="validate3"
/>`;

export default {
    components: {
        NumberInput,
        CodeExample,
        Label
    },
    data() {
        return {
            codeExample,
            min: -10000000,
            max: 10000000,
            inputValue1: 0,
            inputValue2: '4.5324526E6',
            inputValue3: -15,
            isValid1: true,
            isValid2: true,
            isValid3: true
        };
    },
    computed: {
        code() {
            return code;
        },
        input3Text() {
            return this.isValid3 ? 'Valid' : 'Invalid';
        }
    },
    mounted() {
        this.validate1();
        this.validate2();
        this.validate3();
    },
    methods: {
        validate1() {
            this.isValid1 = this.$refs.input1.validate().isValid;
        },
        validate2() {
            this.isValid2 = this.$refs.input2.validate().isValid;
        },
        validate3() {
            this.isValid3 = this.$refs.input3.validate().isValid;
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>NumberInput</h2>
          <p>
            Numeric input field with either type double or integer to set the step size. Spinner controls
            allow the user to increment the value with the mouse or keyboard. It acts as a form
            element, so it emits <code>input</code> events and it has a <code>value</code>. It also has a valid and
            invalid state for styling purposes.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6 inputs">
          <Label
            v-slot="{ labelForId }"
            text="Integer (step-size = 1)"
          >
            <NumberInput
              :id="labelForId"
              ref="input1"
              v-model="inputValue1"
              :min="min"
              :max="max"
              :is-valid="isValid1"
              type="integer"
              title="I am the integer"
              @input="validate1"
            />
          </Label>
          <Label
            v-slot="{ labelForId }"
            text="Double (step-size = .1)"
          >
            <NumberInput
              :id="labelForId"
              ref="input2"
              v-model="inputValue2"
              :min="min"
              :max="max"
              :is-valid="isValid2"
              type="double"
              title="I am the double"
              @input="validate2"
            />
          </Label>
          <Label
            v-slot="{ labelForId }"
            :text="input3Text"
          >
            <NumberInput
              :id="labelForId"
              ref="input3"
              v-model="inputValue3"
              :min="min"
              :max="max"
              :is-valid="isValid3"
              type="integer"
              title="My starting value is invalid"
              @input="validate3"
            />
          </Label>
          <Label
            v-slot="{ labelForId }"
            text="Disabled"
          >
            <NumberInput
              :id="labelForId"
              v-model="inputValue1"
              :min="min"
              :max="max"
              :is-valid="isValid1"
              type="integer"
              title="Disabled"
              disabled
              @input="validate1"
            />
          </Label>
        </div>
        <div class="grid-item-2">
          Integer: {{ inputValue1 }}
          <br>
          Double: {{ inputValue2 }}
          <br>
          {{ input3Text }}: {{ inputValue3 }}
        </div>
        <div class="grid-item-2">
          <u>All</u>
          <br>
          min: -10
          <br>
          max = 10
        </div>
        <div class="grid-item-2" />
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show NumberInput.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
:deep(label > div) {
  margin-bottom: 5px;
}
</style>
