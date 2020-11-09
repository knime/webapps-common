<script>
import CodeExample from './demo/CodeExample';
import TimePartInput from '../../ui/components/forms/TimePartInput';
import code from '!!raw-loader!../../ui/components/forms/TimePartInput';

const codeExample = `<Checkbox v-model="selected">
  I want cookies!
</Checkbox>
<Checkbox v-model="selectedLarge" label-size="large">
  I want larger cookies!
</Checkbox>`;

export default {
    components: {
        TimePartInput,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: false,
            selectedLarge: false
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
          <h2>TimePartInput</h2>
          <p>
            A number input field similar to the NumberInput component but for time units like hours, minutes, seconds
            and milliseconds. It acts as a form element, so it emits an <code>input</code> event when (de-)selected,
            and it has a <code>value</code>. The <code>label-size</code> property can be set to <code>large</code> for
            larger labels.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <TimePartInput />
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show TimeInputPart.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
