<script>
import CodeExample from './demo/CodeExample.vue';
import SearchBar from '../../ui/components/forms/SearchBar.vue';
import code from '!!raw-loader!../../ui/components/forms/SearchBar';

const codeExample = `<SearchBar
  v-model="inputValue"
  label="Search things"
  placeholder="Pattern"
/>
<SearchBar />`;

export default {
    components: {
        SearchBar,
        CodeExample
    },
    data() {
        return {
            codeExample,
            inputValue: '',
            inputValue2: ''
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
          <h2>SearchBar</h2>
          <p>
            Single line string search input with search icon and clear button.
            It acts as a form element, so it emits <code>input</code> events and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6 inputs">
          <SearchBar
            v-model="inputValue"
            label="Search things"
            placeholder="Placeholder"
          />
          <SearchBar
            v-model="inputValue2"
          />
        </div>
        <div class="grid-item-6">
          input value: {{ inputValue }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show SearchBar.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
.inputs >>> > * {
  margin-bottom: 5px;
}
</style>
