<script>
import CodeExample from './demo/CodeExample';
import RadioButtons from '../../ui/components/forms/RadioButtons';
import code from '!!raw-loader!../../ui/components/forms/RadioButtons';

const codeExample = `<RadioButtons
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
        RadioButtons,
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
          <h2>RadioButtons</h2>
          <p>
            A list of choices the user must choose one of them, so it emits an <code>input</code> event
            when something is selected, and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <RadioButtons
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
        <div class="grid-item-5">
          <RadioButtons
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
              text: 'Baz',
              selectedText: 'Baz!!'
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
          <CodeExample summary="Show RadioButtons.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
