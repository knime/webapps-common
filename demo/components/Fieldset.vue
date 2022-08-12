<script>
import CodeExample from './demo/CodeExample.vue';
import InputField from '../../ui/components/forms/InputField.vue';
import Label from '../../ui/components/forms/Label.vue';
import Fieldset from '../../ui/components/forms/Fieldset.vue';
import InfoIcon from '../../ui/assets/img/icons/circle-info.svg';
import code from '!!raw-loader!../../ui/components/forms/Fieldset';

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
      value="secret-password"
    />
  </Label>
</Fieldset>`;

export default {
    components: {
        InputField,
        InfoIcon,
        Label,
        Fieldset,
        CodeExample
    },
    data() {
        return {
            codeExample
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
          <h2>Fieldset</h2>
          <p>
            Fieldset can be used to group multiple form fields.
            Labels inside Fieldsets automagically use their compact size.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Fieldset text="Login">
            <template #icon><InfoIcon /></template>
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
                value="secret-password"
              />
            </Label>
          </Fieldset>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Fieldset.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
