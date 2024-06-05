<script>
import CodeExample from "./demo/CodeExample.vue";
import code from "webapps-common/ui/components/forms/SearchableCheckboxes.vue?raw";
import SearchableCheckboxes from "../../../ui/components/forms/SearchableCheckboxes.vue";
import Label from "webapps-common/ui/components/forms/Label.vue";

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
    Label,
  },
  data() {
    return {
      codeExample,
      selectedHorizontal: ["bar", "baz"],
      selectedVertical: [],
      missingValues: ["bar", "I am a missing Value"],
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
          <Label #default="{ labelForId }" text="Horizontal">
            <SearchableCheckboxes
              :id="labelForId"
              v-model="selectedHorizontal"
              :show-search="true"
              :possible-values="[
                { id: 'foo 1', text: 'Foo 1' },
                { id: 'bar', text: 'Bar' },
                { id: 'baz', text: 'Baz' },
                { id: 'foo 2', text: 'Foo 2' },
                { id: 'bar 2', text: 'Bar 2' },
                { id: 'baz 2', text: 'Baz 2' },
                { id: 'foo 3', text: 'Foo 3' },
                { id: 'bar 3', text: 'Bar 3' },
                { id: 'baz 3', text: 'Baz 3' },
                { id: 'foo 4', text: 'Foo 4' },
                { id: 'bar 4', text: 'Bar 4' },
                { id: 'baz 4', text: 'Baz 4' },
                { id: 'foo 5', text: 'Foo 5' },
                { id: 'bar 5', text: 'Bar 5' },
                { id: 'baz 5', text: 'Baz 5' },
                { id: 'foo 6', text: 'Foo 6' },
                { id: 'bar 6', text: 'Bar 6' },
                { id: 'baz 6', text: 'Baz 6' },
                { id: 'foo 7', text: 'Foo 7' },
                { id: 'bar 7', text: 'Bar 7' },
                { id: 'baz 7', text: 'Baz 7' },
                { id: 'foo 8', text: 'Foo 8' },
                { id: 'bar 8', text: 'Bar 8' },
                { id: 'baz 8', text: 'Baz 8' },
                { id: 'foo 9', text: 'Foo 9' },
                { id: 'bar 9', text: 'Bar 9' },
                { id: 'baz 9', text: 'Baz 9' },
                { id: 'foo 10', text: 'Foo 10' },
                { id: 'bar 10', text: 'Bar 10' },
                { id: 'baz 10', text: 'Baz 10' },
                { id: 'foo 11', text: 'Foo 11' },
                { id: 'bar 11', text: 'Bar 11' },
                { id: 'baz 11', text: 'Baz 11' },
                { id: 'foo 12', text: 'Foo 12' },
                { id: 'bar 12', text: 'Bar 12' },
                { id: 'baz 12', text: 'Baz 12' },
              ]"
            />
          </Label>
        </div>
        <div class="grid-item-2">selected ids: {{ selectedHorizontal }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <Label #default="{ labelForId }" text="Vertical">
            <SearchableCheckboxes
              :id="labelForId"
              v-model="selectedVertical"
              alignment="vertical"
              :show-search="true"
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
          </Label>
        </div>
        <div class="grid-item-2">selected ids: {{ selectedVertical }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <Label #default="{ labelForId }" text="Disabled">
            <SearchableCheckboxes
              :id="labelForId"
              :model-value="[]"
              :disabled="true"
              :show-search="true"
              :size="3"
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
          </Label>
        </div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <Label #default="{ labelForId }" text="It can have missing values">
            <SearchableCheckboxes
              :id="labelForId"
              v-model="missingValues"
              :show-search="true"
              :size="3"
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
          </Label>
        </div>
        <div class="grid-item-2">selected ids: {{ missingValues }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-5">
          <span>Compact</span>
          <SearchableCheckboxes
            :model-value="[]"
            :disabled="true"
            :show-search="true"
            :size="3"
            compact
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
