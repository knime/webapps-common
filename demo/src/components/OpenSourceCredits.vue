<script>
import CodeExample from "./demo/CodeExample.vue";
import OpenSourceCredits from "webapps-common/ui/components/OpenSourceCredits.vue";
import code from "webapps-common/ui/components/OpenSourceCredits.vue?raw";

export default {
  components: {
    OpenSourceCredits,
    CodeExample,
  },
  data() {
    return {
      codeExample: `<OpenSourceCredits
  class="license-content"
  :additional-packages="additionalPackages"
>
  <template v-slot:header="{ title }">
    <section class="headline">
      <div class="grid-container">
        <h2 class="grid-item-12">{{ title = '**Optional slotted header**' }}</h2>
      </div>
    </section>
  </template>
</OpenSourceCredits>`,
      additionalPackages: [
        {
          name: "I am an additional package",
          repository: "/",
          licenseText: "I am a license",
        },
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
            A component for displaying software licenses for packages used in a
            project. Displays default text explaining the how the project uses
            open source components. It lists package names, license text and a
            link to the source of the project in a compact, expandable list. It
            can also receive addition packages via an
            <code>additional-packages</code> prop. These are combined with
            imported packages, de-duplicated and sorted for easy viewing.
            Designed to be used in combination with the existing header of a
            page or layout using slots (Optional).
          </p>
        </div>
      </div>
      <div class="grid-container page-content">
        <OpenSourceCredits
          class="license-content"
          :additional-packages="additionalPackages"
        >
          <template #header="{ title }">
            <section class="headline">
              <div class="grid-container">
                <h2 class="grid-item-12">
                  {{ (title = "**Optional slotted header**") }}
                </h2>
              </div>
            </section>
          </template>
        </OpenSourceCredits>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show OpenSourceCredits.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.page-content {
  outline: 2px dotted purple;

  & .license-content {
    width: 100%;

    & :deep(section:last-child) {
      background: var(--knime-porcelain);
    }
  }
}
</style>
