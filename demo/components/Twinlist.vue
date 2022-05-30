<script>
import CodeExample from './demo/CodeExample';
import Twinlist from '../../ui/components/forms/Twinlist';
import code from '!!raw-loader!../../ui/components/forms/Twinlist';

const codeExample = `<Twinlist
  v-model="selected"
  label-left="Select stuff here"
  label-right="The selected stuff"
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
        Twinlist,
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
          <h2>Twinlist</h2>
          <p>
            Two list boxes for selecting multiple items. It acts as a form element, so it emits an <code>input</code>
            event when selection changes, and it has a <code>value</code>. For keyboard navigation
            inside of the lists see <code>MultiselectListBox</code>. With <code>DoubleClick</code> the items can also
            be moved between the lists.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="selected"
            :size="7"
            label-left="Select from the 7 visible items (size)"
            label-right="The selected stuff"
            :possible-values="[{
              id: 'foo',
              text: 'Foo'
            }, {
              id: 'bar',
              text: 'Bar'
            }, {
              id: 'baz',
              text: 'Baz'
            }, {
              id: 'baz2',
              text: 'Baz 2'
            }, {
              id: 'baz3',
              text: 'Baz 3'
            }, {
              id: 'baz4',
              text: 'Baz 4'
            }, {
              id: 'baz5',
              text: 'Baz 5'
            }, {
              id: 'baz6',
              text: 'Baz 6'
            }, {
              id: 'baz7',
              text: 'Baz 7'
            }, {
              id: 'baz8',
              text: 'Baz 8'
            }, {
              id: 'baz9',
              text: 'Baz 9'
            }, {
              id: 'baz10',
              text: 'Baz 10'
            }, {
              id: 'baz11',
              text: 'Baz 11'
            }]"
          />
        </div>
        <div class="grid-item-6">
          selected ids: {{ selected }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="selected"
            :size="7"
            label-left="Select from the 7 visible items (size)"
            label-right="The selected stuff"
            :possible-values="[{
              id: 'foo',
              text: 'Foo'
            }, {
              id: 'bar',
              text: 'Bar'
            }, {
              id: 'baz',
              text: 'Baz'
            }, {
              id: 'baz2',
              text: 'Baz 2'
            }, {
              id: 'baz3',
              text: 'Baz 3'
            }, {
              id: 'baz4',
              text: 'Baz 4'
            }, {
              id: 'baz5',
              text: 'Baz 5'
            }, {
              id: 'baz6',
              text: 'Baz 6'
            }, {
              id: 'baz7',
              text: 'Baz 7'
            }, {
              id: 'baz8',
              text: 'Baz 8'
            }, {
              id: 'baz9',
              text: 'Baz 9'
            }, {
              id: 'baz10',
              text: 'Baz 10'
            }, {
              id: 'baz11',
              text: 'Baz 11'
            }]"
            :disabled="true"
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
          <CodeExample summary="Show Twinlist.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
