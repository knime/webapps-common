<script>
import { Checkbox } from "@knime/components";

import CodeExample from "./demo/CodeExample.vue";
// import code from "webapps-common/ui/components/forms/Checkbox.vue?raw";
const code = "";

const codeExample = `<Checkbox v-model="selected">
  I want cookies!
</Checkbox>
<Checkbox v-model="selectedLarge" label-size="large">
  I want larger cookies!
</Checkbox>`;

export default {
  components: {
    Checkbox,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      selected: false,
      selectedMissing: true,
      selectedLarge: false,
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
            A checkbox component. It acts as a form element, so it emits an
            <code>input</code> event when (de-)selected, and it has a
            <code>value</code>. The <code>label-size</code> property can be set
            to <code>large</code> for larger labels.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Checkbox v-model="selected"> I want cookies! </Checkbox>
          <br />
          <Checkbox v-model="selectedLarge" label-size="large">
            I want larger cookies!
          </Checkbox>
          <br />
          <Checkbox v-model="selected" disabled>
            This checkbox is disabled!
          </Checkbox>
          <br />
          <Checkbox v-model="selectedMissing" invalid disabled>
            This checkbox is invalid!
          </Checkbox>
        </div>
        <div class="grid-item-6">
          value: {{ selected }}<br />
          value: {{ selectedLarge }} <br /><br /><br />
          value: {{ selectedMissing }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show Checkbox.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
