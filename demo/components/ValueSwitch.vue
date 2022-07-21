<script>
import CodeExample from './demo/CodeExample.vue';
import ValueSwitch from '../../ui/components/forms/ValueSwitch.vue';
import code from '!!raw-loader!../../ui/components/forms/ValueSwitch';

const codeExample = `<ValueSwitch
  v-model="selected"
  :possible-values="[{
    id: 'eur',
    text: 'EUR'
  }, {
    id: 'usd',
    text: 'USD'
  }]"
/>
<ValueSwitch
  v-model="selected"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'barbaz',
    text: 'Barbaz'
  }, {
    id: 'qux',
    text: 'Qux'
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
            selected: 'eur',
            selectedLarge: 'foobar'
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
        <div class="grid-item-4">
          <ValueSwitch
            v-model="selected"
            :possible-values="[{
              id: 'eur',
              text: 'EUR'
            }, {
              id: 'usd',
              text: 'USD'
            }]"
          />
        </div>
        <div class="grid-item-4">
          <ValueSwitch
            v-model="selectedLarge"
            :possible-values="[{
              id: 'baz',
              text: 'Baz'
            }, {
              id: 'foobar',
              text: 'Foobar'
            }, {
              id: 'qux',
              text: 'Qux'
            }]"
          />
        </div>
        <div class="grid-item-4">
          selected id: {{ selected }}<br>
          selected id: {{ selectedLarge }}
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
