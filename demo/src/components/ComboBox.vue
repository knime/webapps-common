<script>
import CodeExample from "./demo/CodeExample.vue";
import ComboBox from "webapps-common/ui/components/forms/ComboBox.vue";
import code from "webapps-common/ui/components/forms/ComboBox.vue?raw";

const codeExample = `<ComboBox
  v-model="modelValue"
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
  :possible-values="values"
  :size-visible-options="3"
  close-dropdown-on-selection
/>`;

export default {
  components: {
    ComboBox,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      selected: [[], [], [], ["Missing"], [], []],
      values: [
        { id: "foo", text: "Foo" },
        { id: "bar", text: "Bar" },
        { id: "baz", text: "Baz" },
        { id: "lorem", text: "Lorem" },
        { id: "ipsum", text: "Ipsum" },
        { id: "dolor", text: "dolor" },
      ],
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
            A combobox component. It emits an <code>update</code> event when an
            option is (de-)selected and has a list of selected
            <code>values</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-3">Default</div>
        <div class="grid-item-6">
          <ComboBox v-model="selected[0]" :possible-values="values" />
        </div>
        <div class="grid-item-3">selected-ids: {{ selected[0] }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-3">Max visible options: 3</div>
        <div class="grid-item-6">
          <ComboBox
            v-model="selected[1]"
            :possible-values="values"
            :size-visible-options="3"
          />
        </div>
        <div class="grid-item-3">selected-ids: {{ selected[1] }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-3">Allow new values</div>
        <div class="grid-item-6">
          <ComboBox
            v-model="selected[2]"
            :possible-values="values"
            allow-new-values
          />
        </div>
        <div class="grid-item-3">selected-ids: {{ selected[2] }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-3">Missing values</div>
        <div class="grid-item-6">
          <ComboBox v-model="selected[3]" :possible-values="values" />
        </div>
        <div class="grid-item-3">selected-ids: {{ selected[3] }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-3">Close dropdown on selection</div>
        <div class="grid-item-6">
          <ComboBox
            v-model="selected[4]"
            :possible-values="values"
            close-dropdown-on-selection
          />
        </div>
        <div class="grid-item-3">selected-ids: {{ selected[4] }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-3">Compact mode</div>
        <div class="grid-item-6">
          <ComboBox
            v-model="selected[5]"
            :possible-values="values"
            close-dropdown-on-selection
            compact
          />
        </div>
        <div class="grid-item-3">selected-ids: {{ selected[5] }}</div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show ComboBox.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
