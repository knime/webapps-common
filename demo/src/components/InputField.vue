<script>
import CodeExample from './demo/CodeExample.vue';
import InputField from 'webapps-common/ui/components/forms/InputField.vue';
import MailIcon from 'webapps-common/ui/assets/img/icons/mail.svg';
import CircleCheckIcon from 'webapps-common/ui/assets/img/icons/circle-check.svg';
import CloseIcon from 'webapps-common/ui/assets/img/icons/close.svg';
import FunctionButton from 'webapps-common/ui/components/FunctionButton.vue';
import code from 'webapps-common/ui/components/forms/InputField.vue?raw';

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
  :model-value="no edit here"
  type="text"
  disabled
/>
<InputField
  type="password"
  model-value="secret-password"
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
  model-value="demo with right aligned slot"
  type="text"
>
  <template v-slot:iconRight><CircleCheckIcon /></template>
</InputField>
<InputField
  model-value="demo with right aligned button"
  type="text"
  ref="buttonDemo"
>
  <template v-slot:iconRight>
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
            model-value="disabled: no edit here"
            type="text"
            disabled
          />
          <InputField
            model-value="invalid"
            :is-valid="false"
            type="text"
          />
          <InputField
            model-value="demo with left icon"
            type="text"
          >
            <template #icon>
              <MailIcon />
            </template>
          </InputField>
          <InputField
            model-value="demo with right icon"
            type="text"
          >
            <template #iconRight>
              <CircleCheckIcon />
            </template>
          </InputField>
          <InputField
            ref="buttonDemo"
            model-value="demo with right aligned buttons"
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
.inputs :deep(> *) {
  margin-bottom: 5px;
}
</style>
