<script>
import CodeExample from './demo/CodeExample.vue';
import FilterIcon from 'webapps-common/ui/assets/img/icons/filter.svg';
import SearchInput from 'webapps-common/ui/components/forms/SearchInput.vue';
import code from 'webapps-common/ui/components/forms/SearchInput.vue?raw';

const codeExample = `<SearchInput
  v-model="inputValue"
  label="Search things"
  placeholder="Placeholder"
/>
<SearchInput />
<SearchInput
  model-value="disabled: no search possible here"
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
<SearchInput
  v-model="inputValue4"
  @focus="onFocus"
>
  <template #icon>
    <FilterIcon />
  </template>
</SearchInput>
<SearchInput
  v-model="inputValue5"
  :show-case-sensitive-search-button="true"
  :show-inverse-search-button="true"
  :initial-inverse-search="true"
  @focus="onFocus"
/>
`;

export default {
    components: {
        SearchInput,
        FilterIcon,
        CodeExample
    },
    data() {
        return {
            codeExample,
            inputValue: '',
            inputValue2: '',
            inputValue3: 'Demo',
            inputValue4: '',
            inputValue5: 'Demo'
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
            Optionally, buttons for case-sensitive search and inverse searchc an
            be shown.
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
          <SearchInput v-model="inputValue2" />
          <SearchInput
            model-value="disabled: no search possible here"
            disabled
          />
          The clear-all button emits a "clear" event that can be listend to:
          <SearchInput
            v-model="inputValue3"
            placeholder="Placeholder"
            @clear="alert('Search cleared')"
          />
          It's possible to use a different icon:
          <SearchInput
            v-model="inputValue4"
            placeholder="A different icon"
            @focus="onFocus"
          >
            <template #icon>
              <FilterIcon />
            </template>
          </SearchInput>
          Buttons for the search options case-sensitivity and inverse-search can
          be displayed.
          <SearchInput
            v-model="inputValue5"
            :show-case-sensitive-search-button="true"
            :show-inverse-search-button="true"
            :initial-inverse-search="true"
            placeholder="Search"
            @focus="onFocus"
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
.inputs :deep(> *) {
  margin-bottom: 5px;
}
</style>
