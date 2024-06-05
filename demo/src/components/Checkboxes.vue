<script>
import CodeExample from "./demo/CodeExample.vue";
import Checkboxes from "webapps-common/ui/components/forms/Checkboxes.vue";
import Label from "webapps-common/ui/components/forms/Label.vue";
import code from "webapps-common/ui/components/forms/Checkboxes.vue?raw";

const codeExample = `<Checkboxes
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
/>`;

export default {
  components: {
    Checkboxes,
    Label,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      selected: ["bar", "baz"],
      withMissing: ["bar", "missing"],
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
            A list of choices to choose of. It emits an <code>input</code> event
            when something is selected, and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <Label #default="{ labelForId }" text="Horizontal">
            <Checkboxes
              :id="labelForId"
              v-model="selected"
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
          </Label>
        </div>
        <div class="grid-item-5">
          <Label #default="{ labelForId }" text="Vertical">
            <Checkboxes
              :id="labelForId"
              v-model="selected"
              alignment="vertical"
              placeholder="Select stuff here vertical!"
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
        <div class="grid-item-5">
          <Label #default="{ labelForId }" text="Disabled">
            <Checkboxes
              :id="labelForId"
              v-model="selected"
              disabled
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
        <div class="grid-item-2">selected ids: {{ selected }}</div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show Checkboxes.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
