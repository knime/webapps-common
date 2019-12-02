<script>
import CodeExample from './demo/CodeExample';
import Checkbox from '../../ui/components/forms/Checkbox';
import code from '!!raw-loader!../../ui/components/forms/Checkbox';

const codeExample = `<Checkbox
  :value="selected"
  @updateValue="updateSelected"
>
  I want cookies!
</Checkbox>`;

export default {
    components: {
        Checkbox,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: false
        };
    },
    computed: {
        code() {
            return code;
        }
    },
    methods: {
        updateSelected(e) {
            this.selected = e;
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Checkbox</h2>
          <p>
            A checkbox component. It acts as a form element, so it emits an <code>input</code> event when (de-)selected,
            and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Checkbox
            :value="selected"
            @updateValue="updateSelected"
          >
            I want cookies!
          </Checkbox>
        </div>
        <div class="grid-item-6">
          value: {{ selected }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Checkbox.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
