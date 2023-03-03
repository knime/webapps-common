<script>
import CodeExample from './demo/CodeExample.vue';
import Multiselect from 'webapps-common/ui/components/forms/Multiselect.vue';
import code from 'webapps-common/ui/components/forms/Multiselect.vue?raw';

const codeExample = `<Multiselect
  v-model="selected"
  placeholder="Select stuff here!"
  :possible-values="[{
    id: 'foo',
    text: 'Foo'
  }, {
    id: 'bar',
    text: 'Bar',
    disabled: true
  }, {
    id: 'baz',
    text: 'Baz',
    selectedText: 'Baz!!'
  }]"
  separator=" & "
  :summary-max-item-count="2"
  summary-name="users"
/>`;

const POSSIBLE_VALUES = [{
    id: 'foo',
    text: 'Foo'
}, {
    id: 'bar',
    text: 'Bar'
}, {
    id: 'baz',
    text: 'Baz',
    selectedText: 'Baz!!'
}];

const POSSIBLE_VALUES_WITH_DISABLED = [
    {
        id: 'buzz',
        text: 'Buzz',
        disabled: true
    },
    ...POSSIBLE_VALUES
];

export default {
    components: {
        Multiselect,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: [
                [],
                [],
                ['foo', 'bar', 'baz'],
                ['foo', 'bar', 'baz'],
                ['foo', 'bar', 'baz']
            ],
            possibleValues: POSSIBLE_VALUES,
            possibleValuesWithDisabled: POSSIBLE_VALUES_WITH_DISABLED
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
          <h2>Multiselect</h2>
          <p>
            A dropdown for selecting multiple items. It acts as a form element, so it emits an <code>input</code> event
            when something is (de-)selected, and it has a <code>value</code>.
          </p>
        </div>
      </div>

      <div class="grid-container">
        <div class="grid-item-3">
          default
        </div>
        <div class="grid-item-5">
          <Multiselect
            v-model="selected[0]"
            :possible-values="possibleValues"
          />
        </div>
        <div class="grid-item-3">
          selected ids: {{ selected[0] }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-3">
          placeholder
        </div>
        <div class="grid-item-5">
          <Multiselect
            v-model="selected[1]"
            placeholder="Select stuff here!"
            :possible-values="possibleValues"
          />
        </div>
        <div class="grid-item-3">
          selected ids: {{ selected[1] }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-3">
          disabled items
        </div>
        <div class="grid-item-5">
          <Multiselect
            v-model="selected[2]"
            placeholder="Select stuff here!"
            :possible-values="possibleValuesWithDisabled"
          />
        </div>
        <div class="grid-item-3">
          selected ids: {{ selected[2] }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-3">
          custom separator
        </div>
        <div class="grid-item-5">
          <Multiselect
            v-model="selected[3]"
            placeholder="Select stuff here!"
            :possible-values="possibleValues"
            separator=" & "
          />
        </div>
        <div class="grid-item-3">
          selected ids: {{ selected[3] }}
        </div>
      </div>
      <br>
      <div class="grid-container">
        <div class="grid-item-3">
          summaryMaxItemCount & summaryName
        </div>
        <div class="grid-item-5">
          <Multiselect
            v-model="selected[4]"
            placeholder="Select stuff here!"
            :possible-values="possibleValues"
            :summary-max-item-count="2"
            summary-name="users"
          />
        </div>
        <div class="grid-item-3">
          selected ids: {{ selected[4] }}
        </div>
      </div>
      <br>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Multiselect.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>