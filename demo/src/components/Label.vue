<script>
import CodeExample from './demo/CodeExample.vue';
import InputField from 'webapps-common/ui/components/forms/InputField.vue';
import Label from 'webapps-common/ui/components/forms/Label.vue';
import code from 'webapps-common/ui/components/forms/Label.vue?raw';

const codeExample = `<!-- The labelForId syntax is used to associate the label with the form field --\>
<Label
  v-slot="{ labelForId }"
  text="Label for a field"
>
    <!-- The id attribute will be replaced with a generated unique ID --\>
    <InputField
      :id="labelForId"
      type="text"
      placeholder="I'm a placeholder"
    />
</Label>
<Label
  v-slot="{ labelForId }"
  text="Compact label for a field"
  compact
>
  <InputField
    :id="labelForId"
    type="text"
    placeholder="I'm a placeholder"
  />
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
            Labels for form fields. Beside their default size, they come with a smaller one as well which can be enabled
            by setting the <code>compact</code> prop or
            <a href="https://vuejs.org/v2/guide/components-edge-cases.html#Dependency-Injection">providing</a>
            <code>compactLabels: true</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <Label
            v-slot="{ labelForId }"
            text="Label for a field"
          >
            <InputField
              :id="labelForId"
              type="text"
              placeholder="I'm a placeholder"
            />
          </Label>
        </div>
        <div class="grid-item-6">
          <Label
            v-slot="{ labelForId }"
            text="Compact label for a field"
            compact
          >
            <InputField
              :id="labelForId"
              type="text"
              placeholder="I'm a placeholder"
            />
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

<style lang="postcss" scoped>

.grid-item-6 {
  display: flex;
  align-items: flex-end;

  & > * {
    flex-grow: 1;
  }
}

</style>
