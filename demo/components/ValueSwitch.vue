<script>
import CodeExample from './demo/CodeExample';
import ValueSwitch from '../../ui/components/forms/ValueSwitch';
import code from '!!raw-loader!../../ui/components/forms/ValueSwitch';

const codeExample = `<ValueSwitch
  v-model="selected"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz'
  }]"
/>
`;

export default {
    components: {
        ValueSwitch,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: 'bar'
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
          <h2>ValueSwitch</h2>
          <p>
            A list of choices the user must choose one of. It emits an <code>input</code> event
            when something is selected, and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <ValueSwitch
            v-model="selected"
            :possible-values="[{
              id: 'foo',
              text: 'Foo'
            }, {
              id: 'bar',
              text: 'Bar'
            }, {
              id: 'baz',
              text: 'Baz'
            }]"
          />
        </div>
        <div class="grid-item-5">
          selected id: {{ selected }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show ValueSwitch.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
