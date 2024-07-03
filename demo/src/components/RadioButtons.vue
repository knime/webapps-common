<script>
import CodeExample from "./demo/CodeExample.vue";
import { RadioButtons } from "@knime/components";
// import code from "webapps-common/ui/components/forms/RadioButtons.vue?raw";
const code = "";

const codeExample = `<RadioButtons
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
/>
<RadioButtons
  v-model="selected"
  alignment="vertical"
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
/>
`;

export default {
  components: {
    RadioButtons,
    CodeExample,
  },
  data() {
    return {
      codeExample,
      selected: "bar",
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
            A list of choices the user must choose one of. It emits an
            <code>input</code> event when something is selected, and it has a
            <code>value</code>.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <RadioButtons
            v-model="selected"
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
        </div>
        <div class="grid-item-5">
          <RadioButtons
            v-model="selected"
            alignment="vertical"
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
        </div>
        <div class="grid-item-5">
          <RadioButtons
            v-model="selected"
            alignment="vertical"
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
            disabled
          />
        </div>
        <div class="grid-item-5">
          <RadioButtons
            v-model="selected"
            alignment="vertical"
            :possible-values="[
              {
                id: 'foo',
                text: 'Foo',
              },
              {
                id: 'bar',
                text: 'Bar',
                disabled: true,
              },
              {
                id: 'baz',
                text: 'Baz',
              },
            ]"
          />
        </div>
        <div class="grid-item-2">selected id: {{ selected }}</div>
      </div>
      <div class="grid-container">
        <div class="grid-item-12">
          <p>
            Horizontal and vertical layout with subtext. Optionally, a margin
            can be specified by setting the CSS variable
            <code>--radio-button-margin</code>, which defaults to 0.
          </p>
        </div>
      </div>
      <div class="grid-container">
        <div class="grid-item-5">
          <div class="grid-item-5">
            <RadioButtons
              v-model="selected"
              :possible-values="[
                {
                  id: 'foo',
                  text: 'Foo',
                  subtext: 'Subtext',
                },
                {
                  id: 'bar',
                  text: 'Bar',
                  subtext: 'Even longer subtext',
                },
                {
                  id: 'baz',
                  text: 'Baz',
                  subtext: 'Very very looooong subtext below the option',
                },
              ]"
            />
          </div>
        </div>
        <div class="grid-item-5">
          <div class="grid-item-5">
            <RadioButtons
              v-model="selected"
              alignment="vertical"
              class="radio-button-margin"
              :possible-values="[
                {
                  id: 'foo',
                  text: 'Foo',
                  subtext: 'Subtext',
                },
                {
                  id: 'bar',
                  text: 'Bar',
                  subtext: 'Even longer subtext',
                },
                {
                  id: 'baz',
                  text: 'Baz',
                  subtext: 'Very very looooong subtext below the option',
                },
              ]"
            />
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show RadioButtons.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style scoped lang="postcss">
.radio-button-margin {
  --radio-button-margin: 0 0 30px 0; /* optionally a margin can be specified */
}
</style>
