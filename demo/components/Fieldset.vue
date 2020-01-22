<script>
import CodeExample from './demo/CodeExample';
import InputField from '../../ui/components/forms/InputField';
import Label from '../../ui/components/forms/Label';
import Fieldset from '../../ui/components/forms/Fieldset';
import InfoIcon from '../../ui/assets/img/icons/circle-info.svg?inline';
import code from '!!raw-loader!../../ui/components/forms/Fieldset';

const codeExample = `<Fieldset text="Login">
  <template v-slot:icon><InfoIcon /></template>
  <Label text="User">
    <InputField
      type="text"
    />
  </Label>
  <Label text="Password">
    <InputField
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
            Labels inside Fieldsets get a smaller font.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Fieldset text="Login">
            <template v-slot:icon><InfoIcon /></template>
            <Label text="User">
              <InputField
                type="text"
              />
            </Label>
            <Label text="Password">
              <InputField
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
