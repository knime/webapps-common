<script>
import CodeExample from "./demo/CodeExample.vue";
import code from "webapps-common/ui/components/forms/SearchableCheckboxes.vue?raw";
import SearchableCheckboxes from "../../../ui/components/forms/SearchableCheckboxes.vue";

const codeExample = `<SearchableCheckboxes
  v-model="selected"
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

  <SearchableCheckboxes
            v-model="selected"
            show-search="true"
            placeholder="Select stuff here!"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />

          <SearchableCheckboxes
            v-model="selected"
            :disabled="true"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />

/>`;

export default {
  components: {
    CodeExample,
    SearchableCheckboxes,
  },
  data() {
    return {
      codeExample,
      selected: ["bar", "baz"],
    };
  },
  computed: {
    code() {
      return code;
    },
  },
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            Checkboxes with a search field enabled and an initial search term
            defined. Case-sensitive search can be enabled through a button on
            the right.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <span>Horizontal</span>
          <SearchableCheckboxes
            v-model="selected"
            placeholder="Select stuff here!"
            show-search="true"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
              {
                id: 'baz 1',
                text: 'Baz 1',
              },
              {
                id: 'baz 2',
                text: 'Baz 2',
              },

              {
                id: 'baz 3',
                text: 'Baz 3',
              },
              {
                id: 'baz 4',
                text: 'Baz 4',
              },
              {
                id: 'baz 5',
                text: 'Baz 6',
              },
              {
                id: 'baz 6',
                text: 'Baz 6',
              },

              {
                id: 'baz 7',
                text: 'Baz 7',
              },
              {
                id: 'baz 8',
                text: 'Baz 8',
              },
              {
                id: 'baz 9',
                text: 'Baz 9',
              },
              {
                id: 'baz 10',
                text: 'Baz 10',
              },

              {
                id: 'baz 11',
                text: 'Baz 11',
              },
              {
                id: 'baz 12',
                text: 'Baz 12',
              },
            ]"
          />
        </div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <span>Vertical</span>
          <SearchableCheckboxes
            v-model="selected"
            alignment="vertical"
            placeholder="Select stuff here vertical!"
            show-search="true"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
              {
                id: 'baz 1',
                text: 'Baz 1',
              },
              {
                id: 'baz 2',
                text: 'Baz 2',
              },

              {
                id: 'baz 3',
                text: 'Baz 3',
              },
              {
                id: 'baz 4',
                text: 'Baz 4',
              },
              {
                id: 'baz 5',
                text: 'Baz 6',
              },
              {
                id: 'baz 6',
                text: 'Baz 6',
              },

              {
                id: 'baz 7',
                text: 'Baz 7',
              },
              {
                id: 'baz 8',
                text: 'Baz 8',
              },
              {
                id: 'baz 9',
                text: 'Baz 9',
              },
              {
                id: 'baz 10',
                text: 'Baz 10',
              },

              {
                id: 'baz 11',
                text: 'Baz 11',
              },
              {
                id: 'baz 12',
                text: 'Baz 12',
              },
            ]"
          />
        </div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <span>Disabled</span>
          <SearchableCheckboxes
            v-model="selected"
            :disabled="true"
            show-search="true"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />
        </div>
        <div class="grid-item-2">selected ids: {{ selected }}</div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show SearchableCheckboxes.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
