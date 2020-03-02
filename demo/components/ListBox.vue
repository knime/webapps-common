<script>
import CodeExample from './demo/CodeExample';
import ListBox from '../../ui/components/forms/ListBox';
import code from '!!raw-loader!../../ui/components/forms/ListBox';

const codeExample = `<ListBox
  v-model="selected"
  aria-label="List"
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
        ListBox,
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
          <h2>ListBox</h2>
          <p>
            A list of choices the user must choose one of them, so it emits an <code>input</code> event
            when something is selected, and it has a <code>value</code>. It can have a <code>size</code> which
            defines the visible items. Keyboard navigation works (<code>Up</code>/<code>Down</code> and
            <code>Home</code>/<code>End</code>).
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <ListBox
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
          <ListBox
            v-model="selected"
            aria-label="A limited list"
            :size="3"
            :possible-values="[{
              id: 'foo',
              text: 'Foo'
            }, {
              id: 'bar',
              text: 'Bar'
            }, {
              id: 'bar2',
              text: 'Bar 2'
            }, {
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
              text: 'Bar 7'
            }, {
              id: 'bar8',
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
              id: 'bar12',
              text: 'Bar 12'
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
          <CodeExample summary="Show ListBox.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
