<script>
import CodeExample from './demo/CodeExample.vue';
import Combobox from 'webapps-common/ui/components/forms/ComboBox.vue';
import code from 'webapps-common/ui/components/forms/ComboBox.vue?raw';

const codeExample = `<Combobox
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
  @update:selected-values="selectedValues => selected = selectedValues"
/>`;

export default {
    components: {
        Combobox,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: [],
            values: [{ id: 'foo', text: 'Foo' }, { id: 'bar', text: 'Bar' }, { id: 'baz', text: 'Baz' }]
        };
    },
    computed: {
        code() {
            return code;
        }
    },
    mounted() {
        const words = ['jashfl kjsdahf kjsdahf ajksh ksajhf klasjfhkjsdahfksjhfakhfjkdash fah flsakh fkasj jaksdfhla jfh sjlkf asljhf ', 'Lorem', 'ipsum', 'dolor', 'sit', 'amet', 'consectetur', 'adipiscing', 'elit', 'Vivamus', 'nec', 'ex', 'sit', 'amet', 'turpis', 'interdum', 'congue', 'at', 'quis', 'augue', 'Donec', 'id', 'finibus', 'erat', 'Aliquam', 'eros', 'libero', 'convallis', 'quis', 'quam', 'et', 'posuere', 'placerat', 'est', 'In', 'feugiat', 'cursus', 'condimentum'];
        for (let i = 0; i < 100; i++) {
            const word = words[i % words.length];
            this.values.splice(i, 1, { id: `${word.toLowerCase()} ${i}`, text: `${word.toLowerCase()} ${i}` });
        }

    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Combobox</h2>
          <p>
            A combobox component.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Combobox
            :possible-values="values"
            :size="4"
            :initialSelectedIds="selected"
            @update:selected-ids="selectedValues => selected = selectedValues"
          />
        </div>
        <div class="grid-item-6">
          values: {{ selected }}
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
