<script>
import CodeExample from './demo/CodeExample';
import InputField from '../../ui/components/forms/InputField';
import Label from '../../ui/components/forms/Label';
import code from '!!raw-loader!../../ui/components/forms/Label';

const codeExample = `<Label text="Label for a field">
  <template #default="{ labelForId }">
    <InputField
      :id="labelForId"
      type="text"
      placeholder="I'm a placeholder"
    />
  </template>
</Label>`;

export default {
    components: {
        InputField,
        Label,
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
          <h2>Label</h2>
          <p>
            Labels for form fields.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Label text="Label for a field">
            <template #default="{ labelForId }">
              <InputField
                :id="labelForId"
                type="text"
                placeholder="I'm a placeholder"
              />
            </template>
          </Label>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show Label.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>
