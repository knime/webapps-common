<script>
import CodeExample from './demo/CodeExample.vue';
import Multiselect from 'webapps-common/ui/components/forms/Multiselect.vue';
import code from 'webapps-common/ui/components/forms/Multiselect.vue?raw';

const codeExample = `<Multiselect
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
    text: 'Baz',
    selectedText: 'Baz!!'
  }]"
/>`;

export default {
    components: {
        Multiselect,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: []
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
          <h2>Multiselect</h2>
          <p>
            A dropdown for selecting multiple items. It acts as a form element, so it emits an <code>input</code> event
            when something is (de-)selected, and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Multiselect
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
              text: 'Baz',
              selectedText: 'Baz!!'
            }]"
          />
        </div>
        <div class="grid-item-6">
          selected ids: {{ selected }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Multiselect.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
