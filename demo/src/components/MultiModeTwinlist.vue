<script>
import CodeExample from './demo/CodeExample.vue';
import MultiModeTwinlist from 'webapps-common/ui/components/forms/MultiModeTwinlist.vue';
import code from 'webapps-common/ui/components/forms/MultiModeTwinlist.vue?raw';

const codeExample = `<MultiModeTwinlist
  :size="7"
  show-mode
  initial-case-sensitive-pattern
  left-label="Select from the 7 visible items (size)"
  right-label="The selected stuff"
  mode-label="Selection mode"
  initial-pattern="^[ab].*[357]$|\$"
  :initial-selected-types="['Type1', 'Type3']"
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
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: [],
            manuallySelected: ['missing'],
            isCaseSensitivePattern: true,
            isInverted: false,
            mode: 'regex',
            pattern: '^[ab].*[57]$|\$',
            selectedTypes: ['Type1', 'Type'],
            key: 0
        };
    },
    computed: {
        code() {
            return code;
        },
        settingsHash() {
            return [
                `${this.manuallySelected}`,
                `${this.isCaseSensitivePattern}`,
                `${this.isInverted}`,
                `${this.mode}`,
                `${this.pattern}`,
                `${this.selectedTypes}`
            ].join(', ');
        },
        demoValues() {
            return [{
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
            }, ...Array.from({ length: 6 }, (_, i) => ({
                id: `baz${i}`,
                text: `Baz${i}`,
                type: { id: ` type${i}`, text: ` Type ${i}` }
            })),
            {
                id: 'spec1',
                text: 'Special *.^',
                type: { id: 'type1', text: 'Type 1' }
            }, {
                id: 'spec2',
                text: 'Special $?]',
                type: { id: 'type2', text: 'Type 2' }
            }];
        }
    },
    watch: {
        settingsHash(oldVal, newVal) {
            if (oldVal !== newVal) {
                this.key += 1;
            }
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
            A MultiModeTwinlist with mode selection set to initial regex selection. The demo list
            include items with special characters that need to be escaped for regular expression filters.
            On type selection mode, the types of the possible values as well as an additional option are selectable.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <MultiModeTwinlist
            :size="7"
            show-mode
            :initial-case-sensitive-pattern="isCaseSensitivePattern"
            :initial-selected-types="selectedTypes"
            :initial-pattern="pattern"
            :initial-mode="mode"
            :initial-inverse-pattern="isInverted"
            :initial-manually-selected="manuallySelected"
            :additional-possible-types="[{id: 'additionalId', text: 'additionalOption'}]"
            left-label="Select from the visible items"
            right-label="The selected stuff"
            mode-label="Selection mode"
            :possible-values="demoValues"
            @input="(event) => {
              selected = event
              if(event.isManual) {
                manuallySelected = event.selected
              }
            }"
            @pattern-input="(event) => pattern = event"
            @mode-input="(event) => mode = event"
            @types-input="(event) => selectedTypes = event"
            @inverse-pattern-input="(event) => isInverted = event"
            @case-sensitive-pattern-input="(event) => isCaseSensitivePattern = event"
          />
        </div>
        <div class="grid-item-6">
          selected ids: {{ selected.selected }}
          <br v-if="selected.isManual">
          {{ selected.isManual ? 'deselected ids: ': '' }}{{ selected.deselected }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-6">
          <MultiModeTwinlist
            :key="key"
            disabled
            :size="7"
            show-mode
            :initial-case-sensitive-pattern="isCaseSensitivePattern"
            :initial-selected-types="selectedTypes"
            :initial-pattern="pattern"
            :initial-mode="mode"
            :initial-inverse-pattern="isInverted"
            :initial-manually-selected="manuallySelected"
            :additional-possible-types="[{id: 'additionalId', text: 'additionalOption'}]"
            left-label="Select from the visible items"
            right-label="The selected stuff"
            mode-label="Selection mode"
            :possible-values="demoValues"
          />
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            Optionally, labels can be shown and customized:
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <MultiModeTwinlist
            :key="key"
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
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show MultiModeTwinlist.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
