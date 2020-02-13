<script>
import CodeExample from './demo/CodeExample';
import Checkboxes from '../../ui/components/forms/Checkboxes';
import code from '!!raw-loader!../../ui/components/forms/Multiselect';

const codeExample = `<Checkboxes
  v-model="selected"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar'
  }, {
    id: 'baz',
    text: 'Baz',
    selectedText: 'Baz!!'
  }]"
/>`;

export default {
    components: {
        Checkboxes,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: ['bar', 'baz']
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
          <h2>Checkboxes</h2>
          <p>
            A list of choices the user must choose some of them or none, so it emits an <code>input</code> event
            when something is selected, and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Checkboxes
            v-model="selected"
            placeholder="Select stuff here!"
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
          <Checkboxes
            v-model="selected"
            alignment="vertical"
            placeholder="Select stuff here vertical!"
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
        <div class="grid-item-2">
          selected id: {{ selected }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Checkboxes.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
