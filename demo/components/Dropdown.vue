<script>
import CodeExample from './demo/CodeExample';
import Dropdown from '../../ui/components/forms/Dropdown';
import code from '!!raw-loader!../../ui/components/forms/Dropdown';

const codeExample = `<Dropdown
  v-model="selected"
  aria-label="A Dropdown"
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
/>`;

export default {
    components: {
        Dropdown,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: 'bar',
            placeholderModel: ''
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
          <h2>Dropdown</h2>
          <p>
            A list of choices the user must choose one of them, so it emits an <code>input</code> event
            when something is selected, and it has a <code>value</code>. Keyboard navigation works
            (<code>Enter</code> <code>Up</code>/<code>Down</code> and <code>Home</code>/<code>End</code>, leave
            with <code>Esc</code>).
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="selected"
            aria-label="A List"
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
          <Dropdown
            v-model="selected"
            aria-label="A limited list"
            size="3"
            :possible-values="[{
              id: 'foo',
              text: 'Foo'
            }, {
              id: 'bar',
              text: 'Bar'
            },{
              id: 'bar2',
              text: 'Bar 2'
            },{
              id: 'bar3',
              text: 'Bar 3'
            }, {
              id: 'bar4',
              text: 'Bar 4'
            }, {
              id: 'bar5',
              text: 'Bar 5'
            }, {
              id: 'bar6',
              text: 'Bar 6'
            }, {
              id: 'bar7',
              text: 'Bar 8'
            }, {
              id: 'bar9',
              text: 'Bar 9'
            }, {
              id: 'bar10',
              text: 'Bar 10'
            }, {
              id: 'bar11',
              text: 'Bar 11'
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
      <div class="grid-container">
        <div class="grid-item-6">
          <p>
            Placeholder and Error (<code>isValid=false</code>) states:
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Dropdown
            v-model="placeholderModel"
            placeholder="Placeholder…"
            aria-label="A List"
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
          <Dropdown
            v-model="placeholderModel"
            placeholder="Placeholder…"
            :is-valid="false"
            aria-label="A limited list"
            size="3"
            :possible-values="[{
              id: 'foo',
              text: 'Foo'
            }, {
              id: 'bar',
              text: 'Bar'
            },{
              id: 'bar2',
              text: 'Bar 2'
            },{
              id: 'bar3',
              text: 'Bar 3'
            }, {
              id: 'bar4',
              text: 'Bar 4'
            }, {
              id: 'bar5',
              text: 'Bar 5'
            }, {
              id: 'bar6',
              text: 'Bar 6'
            }, {
              id: 'bar7',
              text: 'Bar 8'
            }, {
              id: 'bar9',
              text: 'Bar 9'
            }, {
              id: 'bar10',
              text: 'Bar 10'
            }, {
              id: 'bar11',
              text: 'Bar 11'
            }, {
              id: 'baz',
              text: 'Baz'
            }]"
          />
        </div>
        <div class="grid-item-2">
          selected id: {{ placeholderModel }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Dropdown.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
