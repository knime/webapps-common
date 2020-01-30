<script>
import CodeExample from './demo/CodeExample';
import ListBox from '../../ui/components/forms/ListBox';
import code from '!!raw-loader!../../ui/components/forms/Multiselect';

const codeExample = `<ListBox
  v-model="selected"
  aria-label="List"
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
            defines the visible items. Keyboard naviagation works (<code>Up</code>/<code>Down</code> and
            <code>Home</code>/<code>End</code>). It is fully compatible with the <code>RadioButtons</code> component.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <ListBox
            v-model="selected"
            aria-label="A List"
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
          <ListBox
            aria-label="A limited list"
            v-model="selected"
            size="3"
            placeholder="Select stuff here vertical!"
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
          <CodeExample summary="Show ListBox.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
