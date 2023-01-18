<script>
import CodeExample from './demo/CodeExample.vue';
import Twinlist from '../../ui/components/forms/Twinlist.vue';
import code from '!!raw-loader!../../ui/components/forms/Twinlist';

const codeExample = `<Twinlist
  :size="7"
  left-label="Select stuff here"
  right-label="The selected stuff"
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
  :size="7"
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
  :size="7"
  show-mode
  initial-case-sensitive-search
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
        Twinlist,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected1: [],
            selected2: [],
            selected3: [],
            manuallySelected3: [],
            isCaseSensitiveSearch3: true,
            isInverted3: false,
            mode3: 'regex',
            pattern3: '^[ab].*[357]$|\$',
            selectedTypes3: ['Type1', 'Type3']
        };
    },
    computed: {
        code() {
            return code;
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
                id: 'baz7',
                text: 'Baz 7',
                type: 'Type5'
            }, {
                id: 'baz8',
                text: 'Baz 8',
                type: 'Type6'
            }, {
                id: 'baz9',
                text: 'Baz 9',
                type: 'Type6'
            }, {
                id: 'baz10',
                text: 'Baz 10',
                type: 'Type6'
            }, {
                id: 'baz11',
                text: 'Baz 11',
                type: 'Type6'
            }];
        },
        demoValuesWithSpecialChars() {
            return [...this.demoValues, {
                id: 'spec1',
                text: 'Special *.^',
                type: 'Type1'
            }, {
                id: 'spec2',
                text: 'Special $?]',
                type: 'Type2'
            }];
        }
    }
};
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h2>Twinlist</h2>
          <p>
            Two list boxes for selecting multiple items. It acts as a form element, so it emits an <code>input</code>
            event when selection changes, and it has a <code>value</code>. For keyboard navigation
            inside of the lists see <code>MultiselectListBox</code>. With <code>DoubleClick</code> the items can also
            be moved between the lists.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            :size="7"
            :initial-manually-selected="selected1"
            left-label="Select from the 7 visible items (size)"
            right-label="The selected stuff"
            :possible-values="demoValues"
            @input="(event) => selected1 = event"
          />
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            :size="7"
            :initial-manually-selected="selected1"
            left-label="Select from the 7 visible items (size)"
            right-label="The selected stuff"
            :possible-values="demoValues"
            disabled
          />
        </div>
        <div class="grid-item-6">
          selected ids: {{ selected1 }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-6">
          <p>
            The Twinlist with a search field enabled and an initial
            search term defined. Case-sensitive search as well as inverse search
            can be enabled through the respective search field buttons.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            :size="7"
            show-search
            :initial-manually-selected="selected2"
            left-label="Select from the 7 visible items (size)"
            right-label="The selected stuff"
            search-label="Search items"
            search-placeholder="Placeholder"
            initial-search-term="bar"
            :possible-values="demoValues"
            @input="(event) => selected2 = event"
          />
        </div>
        <div class="grid-item-6">
          selected ids: {{ selected2 }}
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <p>
            A Twinlist with mode selection enabled and set to initial regex selection. The demo list also
            include items with special characters that need to be escaped for
            regular expression filters:
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            :size="7"
            show-mode
            :initial-case-sensitive-search="isCaseSensitiveSearch3"
            :initial-selected-types="selectedTypes3"
            :initial-pattern="pattern3"
            :initial-mode="mode3"
            :initial-inverse-search="isInverted3"
            :initial-manually-selected="manuallySelected3"
            left-label="Select from the 7 visible items (size)"
            right-label="The selected stuff"
            mode-label="Selection mode"
            :possible-values="demoValuesWithSpecialChars"
            @input="(event, isManual) => {
              selected3 = event
              if(isManual) {
                manuallySelected3 = event
              }
            }"
            @patternInput="(event) => pattern3 = event"
            @modeInput="(event) => mode3 = event"
            @typesInput="(event) => selectedTypes3 = event"
            @inverseSearchInput="(event) => isInverted3 = event"
            @caseSensitiveSearchInput="(event) => isCaseSensitiveSearch3 = event"
          />
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Twinlist
            disabled
            :size="7"
            show-mode
            :initial-case-sensitive-search="isCaseSensitiveSearch3"
            :initial-selected-types="selectedTypes3"
            :initial-pattern="pattern3"
            :initial-mode="mode3"
            :initial-inverse-search="isInverted3"
            :initial-manually-selected="manuallySelected3"
            left-label="Select from the 7 visible items (size)"
            right-label="The selected stuff"
            mode-label="Selection mode"
            :possible-values="demoValuesWithSpecialChars"
          />
        </div>
        <div class="grid-item-6">
          selected ids: {{ selected3 }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Twinlist.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
