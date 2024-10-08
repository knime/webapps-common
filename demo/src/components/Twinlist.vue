<script>
import { markRaw } from "vue";

import { LoadingIcon, Twinlist } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";
// import code from "webapps-common/ui/components/forms/Twinlist.vue?raw";
const code = "";

const codeExample = `<Twinlist
  v-model="selected"
  left-label="Select stuff here"
  right-label="The selected stuff"
  initial-search-term=""
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
<Twinlist
  v-model="selected"
  show-search
  left-label="Select stuff here"
  right-label="The selected stuff"
  search-label="Search items"
  search-placeholder="Placeholder"
  initial-search-term="bar"
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
<Twinlist
  v-model="selectedSearchLabel"
  show-search
  left-label="Select from the visible items"
  right-label="The selected stuff"
  search-label="Search items"
  search-placeholder="Placeholder"
  :with-search-label="true"
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
    CodeExample,
  },
  data() {
    return {
      codeExample,
      selected: [],
      includeUnknownValues: false,
      withMissing: ["foo", "I am missing", "bar"],
      withUnknownValues: {
        includedValues: ["foo", "I am missing", "bar"],
        excludedValues: [
          "baz",
          "I am missing on the left",
          "baz2",
          "baz3",
          "baz4",
          "baz5",
          "baz6",
          "baz7",
          "baz8",
          "baz9",
          "baz10",
          "baz11",
        ],
        includeUnknownValues: true,
      },
      selectedUnknown: [],
      selectedSearchLabel: [],
      selected2: [],
      loadingIconRef: markRaw(LoadingIcon),
    };
  },
  computed: {
    code() {
      return code;
    },
    demoValues() {
      return [
        {
          id: "foo",
          text: "Foo",
        },
        {
          id: "bar",
          text: "Bar",
        },
        {
          id: "baz",
          text: "Baz",
        },
        {
          id: "baz2",
          text: "Baz 2",
        },
        {
          id: "baz3",
          text: "Baz 3",
        },
        {
          id: "baz4",
          text: "Baz 4",
        },
        {
          id: "baz5",
          text: "Baz 5",
        },
        {
          id: "baz6",
          text: "Baz 6",
        },
        {
          id: "baz7",
          text: "Baz 7",
        },
        {
          id: "baz8",
          text: "Baz 8",
        },
        {
          id: "baz9",
          text: "Baz 9",
        },
        {
          id: "baz10",
          text: "Baz 10",
        },
        {
          id: "baz11",
          text: "Baz 11",
        },
      ];
    },
  },
  methods: {
    updateExcludedMissing(newMissingValues) {
      this.excludedMissing = newMissingValues;
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
            Two list boxes for selecting multiple items. It acts as a form
            element, so it emits an <code>input</code> event when selection
            changes, and it has a <code>value</code>. For keyboard navigation
            inside of the lists see <code>MultiselectListBox</code>. With
            <code>DoubleClick</code> the items can also be moved between the
            lists.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="selected"
            :size="7"
            left-label="Select from the 7 visible items (size)"
            right-label="The selected stuff"
            :possible-values="demoValues"
          />
        </div>
        <div class="grid-item-6">selected ids: {{ selected }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="selected"
            :size="7"
            left-label="Select from the visible items"
            right-label="The selected stuff"
            :possible-values="demoValues"
            disabled
          />
        </div>
        <div class="grid-item-6">selected ids: {{ selected }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-6">
          <p>
            The Twinlist with a search field enabled and an initial search term
            defined. Case-sensitive search can be enabled through a button on
            the right.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="selected"
            :size="7"
            show-search
            left-label="Select from the visible items"
            right-label="The selected stuff"
            search-label="Search items"
            search-placeholder="Placeholder"
            initial-search-term="bar"
            :possible-values="demoValues"
          />
        </div>
        <div class="grid-item-6">selected ids: {{ selected }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <p>The Twinlist with missing selected items.</p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="withMissing"
            :show-unknown-values="true"
            :size="7"
            show-search
            left-label="Select from the visible items"
            right-label="The selected stuff"
            search-label="Search items"
            search-placeholder="Placeholder"
            :possible-values="demoValues"
          />
        </div>
        <div class="grid-item-6">
          {{ withMissing }}
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <p>The Twinlist with unknown items.</p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="withUnknownValues"
            :size="7"
            show-search
            :show-unknown-values="true"
            unknown-values-text="My unknowns"
            left-label="Select from the visible items"
            right-label="The selected stuff"
            search-placeholder="Placeholder"
            :possible-values="demoValues"
          />
        </div>
        <div class="grid-item-6">selected ids: {{ withUnknownValues }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <p>The Twinlist can show a customizable search label.</p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="selectedSearchLabel"
            :size="7"
            show-search
            left-label="Select from the visible items"
            right-label="The selected stuff"
            search-label="Search items"
            search-placeholder="Placeholder"
            :with-search-label="true"
            :possible-values="demoValues"
          />
        </div>
        <div class="grid-item-6">selected ids: {{ selectedSearchLabel }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <p>The content visible in empty boxes is customizable.</p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="selected2"
            :size="7"
            left-label="Select from the visible items"
            right-label="The selected stuff"
            :possible-values="demoValues"
            :empty-state-component="loadingIconRef"
          />
        </div>
        <div class="grid-item-6">selected ids: {{ selectedSearchLabel }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <p>Compact mode</p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="selected2"
            :size="7"
            show-search
            left-label="Select from the visible items"
            right-label="The selected stuff"
            search-label="Search items"
            search-placeholder="Placeholder"
            :possible-values="demoValues"
            compact
          />
        </div>
        <div class="grid-item-6">selected ids: {{ selectedSearchLabel }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <p>Resizable Twinlist</p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            v-model="selected2"
            :size="7"
            left-label="Select from the visible items"
            right-label="The selected stuff"
            :possible-values="demoValues"
            compact
            show-resize-handle
          />
        </div>
        <div class="grid-item-6">selected ids: {{ selected2 }}</div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show Twinlist.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
