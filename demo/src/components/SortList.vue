<script lang="ts">
import CodeExample from "./demo/CodeExample.vue";
import SortList from "webapps-common/ui/components/forms/SortList.vue";
import code from "webapps-common/ui/components/forms/SortList.vue?raw";

const codeExample = `<SortList
  v-model="selected"
  :ariaLabel="myAriaLabel"
  :model-value="['foo', 'baz', 'bar', 'missing']"
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
/>`;

const numElements = 20;

export default {
  components: {
    SortList,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      modelValue: [
        "missing",
        ...Array.from({ length: numElements }, (_v, i) => `${i}`),
      ],
    };
  },
  computed: {
    code() {
      return code;
    },
    demoValues() {
      return Array.from({ length: numElements }, (_v, i) => ({
        id: `${i}`,
        text: `Element_${i}`,
      }));
    },
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>A multiselect listbox with sorting capabilities.</p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <!--  eslint-disable vue/attribute-hyphenation ariaLabel needs to be given like this for typescript to not complain -->
          <SortList
            v-model="modelValue"
            ariaLabel="myAriaLabel"
            :possible-values="demoValues"
          />
        </div>
        <div class="grid-item-6">modelValue: {{ modelValue }}</div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show SortList.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
