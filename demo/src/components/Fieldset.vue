<script>
import { Fieldset, InputField, Label } from "@knime/components";
import InfoIcon from "@knime/styles/img/icons/circle-info.svg";

import CodeExample from "./demo/CodeExample.vue";
// import code from "webapps-common/ui/components/forms/Fieldset.vue?raw";
const code = "";

const codeExample = `<Fieldset text="Login">
  <template v-slot:icon><InfoIcon /></template>
  <Label
    v-slot="{ labelForId }"
    text="User"
  >
    <InputField
      :id="labelForId"
      type="text"
    />
  </Label>
  <Label
    v-slot="{ labelForId }"
    text="Password"
  >
    <InputField
      :id="labelForId"
      type="password"
      model-value="secret-password"
    />
  </Label>
</Fieldset>`;

export default {
  components: {
    InputField,
    InfoIcon,
    Label,
    Fieldset,
    CodeExample,
  },
  data() {
    return {
      codeExample,
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
            Fieldset can be used to group multiple form fields. Labels inside
            Fieldsets automatically use their default size.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Fieldset text="Login">
            <template #icon><InfoIcon /></template>
            <Label #default="{ labelForId }" text="User">
              <InputField :id="labelForId" type="text" />
            </Label>
            <Label #default="{ labelForId }" text="Password">
              <InputField
                :id="labelForId"
                type="password"
                model-value="secret-password"
              />
            </Label>
          </Fieldset>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Fieldset text="Login Compact">
            <template #icon><InfoIcon /></template>
            <Label #default="{ labelForId }" text="User">
              <InputField :id="labelForId" compact type="text" />
            </Label>
            <Label #default="{ labelForId }" text="Password">
              <InputField
                :id="labelForId"
                type="password"
                model-value="secret-password"
                compact
              />
            </Label>
          </Fieldset>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show Fieldset.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
