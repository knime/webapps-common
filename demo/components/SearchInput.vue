<script>
import CodeExample from './demo/CodeExample.vue';
import SearchInput from '../../ui/components/forms/SearchInput.vue';
import code from '!!raw-loader!../../ui/components/forms/SearchInput';

const codeExample = `<SearchInput
  v-model="inputValue"
  label="Search things"
  placeholder="Placeholder"
/>
<SearchInput />
<SearchInput
  value="disabled: no search possible here"
  disabled
/>
<SearchInput
  v-model="inputValue3"
  placeholder="Placeholder"
  @clear="alert('Search cleared')"
/>
<SearchInput
  v-model="inputValue"
  @focus="onFocus"
/>
`;

export default {
    components: {
        SearchInput,
        CodeExample
    },
    data() {
        return {
            codeExample,
            inputValue: '',
            inputValue2: '',
            inputValue3: 'Demo'
        };
    },
    computed: {
        code() {
            return code;
        }
    },
    methods: {
        alert(msg) {
            window.alert(msg);
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>SearchInput</h2>
          <p>
            Single line string search input with search icon and clear button.
            It acts as a form element, so it emits <code>input</code> events and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6 inputs">
          <SearchInput
            v-model="inputValue"
            label="Search things"
            placeholder="Placeholder"
          />
          <SearchInput
            v-model="inputValue2"
          />
          <SearchInput
            value="disabled: no search possible here"
            disabled
          />
          The clear-all button emits a "clear" event that can be listend to:
          <SearchInput
            v-model="inputValue3"
            placeholder="Placeholder"
            @clear="alert('Search cleared')"
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
          <CodeExample summary="Show SearchInput.vue source code">{{ code }}</CodeExample>
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
