<script>
import CodeExample from './demo/CodeExample.vue';
import ToggleSwitch from 'webapps-common/ui/components/forms/ToggleSwitch.vue';
import code from 'webapps-common/ui/components/forms/ToggleSwitch.vue?raw';

const codeExample = `<ToggleSwitch />
<ToggleSwitch value="true" />`;

export default {
    components: {
        ToggleSwitch,
        CodeExample
    },
    data() {
        return {
            codeExample,
            selected: false,
            selectedLarge: true
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
          <p>
            A toggle switch component. It acts as a form element, so it emits an <code>input</code>
            event when (de-)selected, and it has a <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-6">
          <ToggleSwitch v-model="selected">
            I want cookies!
          </ToggleSwitch>
          <br>
          <ToggleSwitch
            v-model="selectedLarge"
            label-size="large"
          >
            I want larger cookies!
          </ToggleSwitch>
          <p>Without label:</p>
          <ToggleSwitch v-model="selected" />
        </div>
        <div class="grid-item-6">
          value: {{ selected }}<br>
          value: {{ selectedLarge }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{ codeExample }}</CodeExample>
          <CodeExample summary="Show ToggleSwitch.vue source code">{{ code }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">

</style>
