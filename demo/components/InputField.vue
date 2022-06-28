<script>
import CodeExample from './demo/CodeExample';
import InputField from '../../ui/components/forms/InputField';
import MailIcon from '../../ui/assets/img/icons/mail.svg?inline';
import code from '!!raw-loader!../../ui/components/forms/InputField';

const codeExample = `<InputField
  v-model="inputValue"
  type="text"
  title="Insert text"
/>
<Label text="Label of the Input Field">
  <InputField
    v-model="inputValue2"
    type="text"
    placeholder="I'm a placeholder"
  />
</Label>
<InputField
  v-model="inputValue"
  type="text"
  :is-valid="false"
/>
<InputField
  :value="no edit here"
  type="text"
  disabled
/>
<InputField
  type="password"
  value="secret-password"
/>
<InputField
  v-model="inputValue"
  type="text"
>
  <template v-slot:icon><MailIcon /></template>
</InputField>`;

export default {
    components: {
        InputField,
        MailIcon,
        CodeExample
    },
    data() {
        return {
            codeExample,
            inputValue: 'demo text',
            inputValue2: ''
        };
    },
    computed: {
        code() {
            return code;
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>InputField</h2>
          <p>
            Single line string input with optional icon and validity styling.
            It acts as a form element, so it emits <code>input</code> events and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6 inputs">
          <InputField
            v-model="inputValue"
            type="text"
            title="Insert text"
          />
          <InputField
            v-model="inputValue2"
            type="text"
            placeholder="I'm a placeholder"
          />
          <InputField
            value="disabled: no edit here"
            type="text"
            disabled
          />
          <InputField
            v-model="inputValue"
            type="text"
          >
            <template #icon><MailIcon /></template>
          </InputField>
          <InputField
            value="invalid"
            :is-valid="false"
            type="text"
          >
            <template #icon><MailIcon /></template>
          </InputField>
        </div>
        <div class="grid-item-6">
          input value: {{ inputValue }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show InputField.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
.inputs >>> > * {
  margin-bottom: 5px;
}
</style>
