<script>
import CodeExample from './demo/CodeExample';
import TextArea from '../../ui/components/forms/TextArea';
import code from '!!raw-loader!../../ui/components/forms/TextArea';

const codeExample = `<TextArea
  v-model="inputValue"
  title="Insert text"
/>
<TextArea
  v-model="inputValue2"
  placeholder="I'm a placeholder."
/>
<TextArea
  v-model="inputValue3"
  :is-valid="false"
/>
<TextArea
  v-model="inputValue4"
  placeholder="I'm a placeholder."
  :cols="48"
  :rows="8"
/>`;

export default {
    components: {
        TextArea,
        CodeExample
    },
    data() {
        return {
            codeExample,
            inputValue: 'Default settings',
            inputValue2: '',
            inputValue3: 'Invalid style',
            inputValue4: 'I have 8 rows (4 is default) and 48 columns (12 is the default).'
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
          <h2>TextArea</h2>
          <p>
            Multi-line string input with optional invalid styling.
            It acts as a form element, so it emits input events and it has a value.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6 inputs">
          <TextArea
            v-model="inputValue"
            title="Insert text"
          />
          <TextArea
            v-model="inputValue2"
            placeholder="I'm a placeholder."
          />
          <TextArea
            v-model="inputValue3"
            :is-valid="false"
          />
          <br>
          <TextArea
            v-model="inputValue4"
            placeholder="I'm a placeholder."
            :cols="48"
            :rows="8"
          />
        </div>
        <div class="grid-item-6">
          Input 1: {{ inputValue }}
          <br>
          Input 2: {{ inputValue2 }}
          <br>
          Input 3: {{ inputValue3 }}
          <br>
          Input 4: {{ inputValue4 }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show TextArea.vue source code">{{ code }}</CodeExample>
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
