<script>
import CodeExample from './demo/CodeExample.vue';
import ComboBox from 'webapps-common/ui/components/forms/ComboBox.vue';
import code from 'webapps-common/ui/components/forms/ComboBox.vue?raw';

const codeExample = `<ComboBox
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
  :possible-values="values"
  :initialSelectedIds="selected"
  :size-visible-options="3"
  close-dropdown-on-selection
  @update:selected-ids="selectedValues => selected = selectedValues"
/>`;

export default {
    components: {
        ComboBox,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: [[], [], []],
            values: [{ id: 'foo', text: 'Foo' }, { id: 'bar', text: 'Bar' }, { id: 'baz', text: 'Baz' },
                { id: 'lorem', text: 'Lorem' }, { id: 'ipsum', text: 'Ipsum' }, { id: 'dolor', text: 'dolor' }]
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
          <p>
            A combobox component. It emits an <code>update</code> event when an option is (de-)selected and has a list
            of selected <code>values</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-3">
          default
        </div>
        <div class="grid-item-6">
          <ComboBox
            :possible-values="values"
            :initial-selected-ids="selected[0]"
            @update:selected-ids="selectedValues => selected[0] = selectedValues"
          />
        </div>
        <div class="grid-item-3">
          values: {{ selected[0] }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-3">
          max visible options: 3
        </div>
        <div class="grid-item-6">
          <ComboBox
            :possible-values="values"
            :initial-selected-ids="selected[1]"
            :size-visible-options="3"
            @update:selected-ids="selectedValues => selected[1] = selectedValues"
          />
        </div>
        <div class="grid-item-3">
          values: {{ selected[1] }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-3">
          close dropdown on selection
        </div>
        <div class="grid-item-6">
          <ComboBox
            :possible-values="values"
            :initial-selected-ids="selected[2]"
            close-dropdown-on-selection
            @update:selected-ids="selectedValues => selected[2] = selectedValues"
          />
        </div>
        <div class="grid-item-3">
          values: {{ selected[2] }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show ComboBox.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
