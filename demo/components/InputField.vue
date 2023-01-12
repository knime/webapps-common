<script>
import CodeExample from './demo/CodeExample.vue';
import InputField from '../../ui/components/forms/InputField.vue';
import MailIcon from '../../ui/assets/img/icons/mail.svg';
import CircleCheckIcon from '../../ui/assets/img/icons/circle-check.svg';
import CloseIcon from '../../ui/assets/img/icons/close.svg';
import FunctionButton from '../../ui/components/FunctionButton.vue';
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
  v-model="inputValue3"
  type="text"
  placeholder="Required field"
  required
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
  @focus="onFocus"
/>
<InputField
  v-model="inputValue"
  type="text"
>
  <template v-slot:icon><MailIcon /></template>
</InputField>
<InputField
  value="demo with right aligned slot"
  v-model="inputValue"
  type="text"
>
  <template v-slot:iconRight><CircleCheckIcon /></template>
</InputField>
<InputField
  value="demo with right aligned button"
  type="text"
  ref="buttonDemo"
>
  <template #iconRight>
    <FunctionButton
      @click="alert('demo')"
    >
      <CircleCheckIcon />
    </FunctionButton>
    <FunctionButton
      @click="alert('demo 2')"
    >
      <CloseIcon />
    </FunctionButton>
  </template>
</InputField>`;

export default {
    components: {
        InputField,
        FunctionButton,
        CircleCheckIcon,
        CloseIcon,
        MailIcon,
        CodeExample
    },
    data() {
        return {
            codeExample,
            inputValue: 'demo text',
            inputValue2: '',
            inputValue3: ''
        };
    },
    computed: {
        code() {
            return code;
        }
    },
    methods: {
        alert(message) {
            window.alert(message);
            this.$refs.buttonDemo.focus();
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
            v-model="inputValue3"
            type="text"
            placeholder="Required field"
            required
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
          <InputField
            value="demo with right aligned slot"
            type="text"
          >
            <template #iconRight>
              <CircleCheckIcon />
            </template>
          </InputField>
          <InputField
            ref="buttonDemo"
            value="demo with right aligned buttons"
            type="text"
          >
            <template #iconRight>
              <FunctionButton
                @click="alert('demo')"
              >
                <CircleCheckIcon />
              </FunctionButton>
              <FunctionButton
                @click="alert('demo 2')"
              >
                <CloseIcon />
              </FunctionButton>
            </template>
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
