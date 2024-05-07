<script lang="ts">
import CodeExample from "./demo/CodeExample.vue";
import MultiModeTwinlist from "webapps-common/ui/components/forms/MultiModeTwinlist.vue";
import code from "webapps-common/ui/components/forms/MultiModeTwinlist.vue?raw";

const codeExample = `<MultiModeTwinlist
  :size="7"
  show-mode
  case-sensitive-pattern
  left-label="Select from the 7 visible items (size)"
  right-label="The selected stuff"
  mode-label="Selection mode"
  pattern="^[ab].*[357]$|\$"
  :selected-types="['Type1', 'Type3']"
  :possible-values="[{
    id: 'foo',
    text: 'foo',
    type: { id: 'type1', text: 'Type 1' }
  }, {
    id: 'Foo',
    text: 'Foo',
    type: { id: 'type1', text: 'Type 1' }
  }, {
    id: 'bar',
    text: 'Bar',
    type: { id: 'type2', text: 'Type 2' }
  }]"
/>
<MultiModeTwinlist
  :size="7"
  show-mode
  :with-mode-label="false"
  :with-search-label="false"
  :with-pattern-label="false"
  :with-types-label="false"
  left-label="Select from the visible items"
  right-label="The selected stuff"
  :possible-values="[{
    id: 'foo',
    text: 'foo',
    type: { id: 'type1', text: 'Type 1' }
  }, {
    id: 'Foo',
    text: 'Foo',
    type: { id: 'type1', text: 'Type 1' }
  }, {
    id: 'bar',
    text: 'Bar',
    type: { id: 'type2', text: 'Type 2' }
  }]"
/>
`;

export default {
  components: {
    MultiModeTwinlist,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      selected: [],
      withMissing: ["missing"],
      manualSelection: {
        includedValues: ["missing"],
        excludedValues: [
          "foo",
          "Channel Name",
          "Reservation AOV",
          "baz0",
          "baz1",
          "baz2",
          "baz3",
          "baz4",
          "baz5",
          "spec1",
          "spec2",
        ],
        includeUnknownValues: false,
      },
      manualSelection2: [],
      isCaseSensitivePattern: true,
      isInverted: false,
      mode: "regex",
      pattern: "^[ab].*[57]$|\$",
      selectedTypes: ["Type1", "Type"],
      key: 0,
    };
  },
  computed: {
    code() {
      return code;
    },
    settingsHash() {
      return [
        `${this.manualSelection}`,
        `${this.isCaseSensitivePattern}`,
        `${this.isInverted}`,
        `${this.mode}`,
        `${this.pattern}`,
        `${this.selectedTypes}`,
      ].join(", ");
    },
    demoValues() {
      return [
        {
          id: "foo",
          text: "foo",
          type: { id: "type1", text: "Type 1" },
        },
        {
          id: "Channel Name",
          text: "Channel Name",
          type: { id: "type1", text: "Type 1" },
        },
        {
          id: "Reservation AOV",
          text: "Reservation AOV",
          type: { id: "type2", text: "Type 2" },
        },
        ...Array.from({ length: 6 }, (_, i) => ({
          id: `baz${i}`,
          text: `Baz${i}`,
          type: { id: ` type${i}`, text: ` Type ${i}` },
        })),
        {
          id: "spec1",
          text: "Special *.^",
          type: { id: "type1", text: "Type 1" },
        },
        {
          id: "spec2",
          text: "Special $?]",
          type: { id: "type2", text: "Type 2" },
        },
      ];
    },
  },
  watch: {
    settingsHash(oldVal, newVal) {
      if (oldVal !== newVal) {
        this.key += 1;
      }
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
            A MultiModeTwinlist with mode selection set to initial regex
            selection. The demo list include items with special characters that
            need to be escaped for regular expression filters. On type selection
            mode, the types of the possible values as well as an additional
            option are selectable.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <MultiModeTwinlist
            v-model:pattern="pattern"
            v-model:manualSelection="manualSelection"
            v-model:case-sensitive-pattern="isCaseSensitivePattern"
            v-model:inverse-pattern="isInverted"
            v-model:mode="mode"
            v-model:selected-types="selectedTypes"
            show-mode
            :size="7"
            :possible-values="demoValues"
            :additional-possible-types="[
              { id: 'additionalId', text: 'additionalOption' },
            ]"
            left-label="Select from the visible items"
            right-label="The selected stuff"
            mode-label="Selection mode"
            @update:selected="
              (newSelected: any) => {
                selected = newSelected;
              }
            "
          />
        </div>
        <div class="grid-item-6">
          <template v-if="mode === 'manual'">
            <br />
            <span> selected ids: {{ manualSelection.includedValues }} </span>
            <br />
            <span> deselected ids: {{ manualSelection.excludedValues }} </span>
          </template>
        </div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-6">
          <MultiModeTwinlist
            :key="key"
            disabled
            :size="7"
            show-mode
            :case-sensitive-pattern="isCaseSensitivePattern"
            :selected-types="selectedTypes"
            :pattern="pattern"
            :mode="mode"
            :inverse-pattern="isInverted"
            :manual-selection="manualSelection.includedValues"
            :additional-possible-types="[
              { id: 'additionalId', text: 'additionalOption' },
            ]"
            left-label="Select from the visible items"
            right-label="The selected stuff"
            mode-label="Selection mode"
            :possible-values="demoValues"
          />
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>Optionally, labels can be shown and customized:</p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <MultiModeTwinlist
            :key="key"
            v-model:manualSelection="manualSelection2"
            :size="7"
            show-mode
            :with-mode-label="true"
            :with-search-label="true"
            :with-pattern-label="true"
            :with-types-label="true"
            left-label="Select from the visible items"
            right-label="The selected stuff"
            :possible-values="demoValues"
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
          <CodeExample summary="Show MultiModeTwinlist.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
