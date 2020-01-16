<script>
import CodeExample from './demo/CodeExample';
import InputField from '../../ui/components/forms/InputField';
import Label from '../../ui/components/forms/Label';
import Fieldset from '../../ui/components/forms/Fieldset';
import MailIcon from '../../ui/assets/img/icons/mail.svg?inline';
import InfoIcon from '../../ui/assets/img/icons/circle-info.svg?inline';
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
  :disabled="true"
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
        InfoIcon,
        Label,
        Fieldset,
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
            It acts as a form element, so it emits input events and it has a value.
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
          <Label text="Label: Some Input Field">
            <InputField
              v-model="inputValue2"
              type="text"
              placeholder="I'm a placeholder"
            />
          </Label>
          <Fieldset text="Fieldset: Credentials Input">
            <template v-slot:icon><InfoIcon /></template>
            <Label text="Label: User">
              <InputField
                v-model="inputValue"
                type="text"
                :is-valid="false"
              />
            </Label>
            <Label text="Label: Password">
              <InputField
                type="password"
                value="secret-password"
              />
            </Label>
          </Fieldset>

          <InputField
                  value="disabled: no edit here"
                  type="text"
                  :disabled="true"
          />
          <InputField
            v-model="inputValue"
            type="text"
          >
            <template v-slot:icon><MailIcon /></template>
          </InputField>
          <InputField
            value="invalid"
            :is-valid="false"
            type="text"
          >
            <template v-slot:icon><MailIcon /></template>
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
.inputs >>> * {
  margin-bottom: 5px;
}
</style>
