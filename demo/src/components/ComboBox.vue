<script>
import CodeExample from "./demo/CodeExample.vue";
import ComboBox from "webapps-common/ui/components/forms/ComboBox.vue";
import Label from "webapps-common/ui/components/forms/Label.vue";
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
    Label,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      selected: [[], [], [], []],
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
        <div class="grid-item-3">default</div>
        <div class="grid-item-6">
          <Label #default="{ labelForId }" text="Label for combo box">
            <ComboBox
              :id="labelForId"
              v-model="selected[0]"
              :possible-values="values"
            />
          </Label>
        </div>
        <div class="grid-item-3">selected-ids: {{ selected[0] }}</div>
      </div>
      <br />
      <div class="grid-container">
        <div class="grid-item-3">max visible options: 3</div>
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
        <div class="grid-item-3">allow new values</div>
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
        <div class="grid-item-3">close dropdown on selection</div>
        <div class="grid-item-6">
          <ComboBox
            v-model="selected[3]"
            :possible-values="values"
            close-dropdown-on-selection
          />
        </div>
        <div class="grid-item-3">selected-ids: {{ selected[3] }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-3">compact mode</div>
        <div class="grid-item-6">
          <ComboBox
            v-model="selected[3]"
            :possible-values="values"
            close-dropdown-on-selection
            compact
          />
        </div>
        <div class="grid-item-3">selected-ids: {{ selected[3] }}</div>
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
