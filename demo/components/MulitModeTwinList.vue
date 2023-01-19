<script>
import CodeExample from './demo/CodeExample.vue';
import MultiModeTwinlist from '../../ui/components/forms/MultiModeTwinlist.vue';
import code from '!!raw-loader!../../ui/components/forms/MultiModeTwinlist';

const codeExample = `<MultiModeTwinList
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
    text: 'Foo',
    type: 'Type1'
  }, {
    id: 'bar',
    text: 'Bar',
    type: 'Type2'
  }, {
    id: 'baz',
    text: 'Baz',
    type: 'Type1'
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
                type: 'Type1'
            }, {
                id: 'Foo',
                text: 'Foo',
                type: 'Type1'
            }, {
                id: 'bar',
                text: 'Bar',
                type: 'Type2'
            }, {
                id: 'baz',
                text: 'Baz',
                type: 'Type1'
            }, {
                id: 'baz2',
                text: 'Baz 2',
                type: 'Type2'
            }, {
                id: 'baz3',
                text: 'Baz 3',
                type: 'Type3'
            }, {
                id: 'baz4',
                text: 'Baz 4',
                type: 'Type3'
            }, {
                id: 'baz5',
                text: 'Baz 5',
                type: 'Type3'
            }, {
                id: 'baz6',
                text: 'Baz 6',
                type: 'Type4'
            }, {
                id: 'spec1',
                text: 'Special *.^',
                type: 'Type1'
            }, {
                id: 'spec2',
                text: 'Special $?]',
                type: 'Type2'
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
          <h2>MultiModeTwinList</h2>
          <p>
            A MultiModeTwinlist with mode selection set to initial regex selection. The demo list also
            include items with special characters that need to be escaped for regular expression filters:
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
            left-label="Select from the visible items"
            right-label="The selected stuff"
            mode-label="Selection mode"
            :possible-values="demoValues"
            @input="(event, isManual) => {
              selected = event
              if(isManual) {
                manuallySelected = event
              }
            }"
            @patternInput="(event) => pattern = event"
            @modeInput="(event) => mode = event"
            @typesInput="(event) => selectedTypes = event"
            @inversePatternInput="(event) => isInverted = event"
            @caseSensitivePatternInput="(event) => isCaseSensitivePattern = event"
          />
        </div>
      </div>
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
            left-label="Select from the visible items"
            right-label="The selected stuff"
            mode-label="Selection mode"
            :possible-values="demoValues"
          />
        </div>
        <div class="grid-item-6">
          selected ids: {{ selected }}
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
