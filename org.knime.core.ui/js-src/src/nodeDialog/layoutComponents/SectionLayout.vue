<script>
import { defineComponent } from "vue";
import {
  useJsonFormsLayout,
  rendererProps,
  DispatchRenderer,
} from "@jsonforms/vue";
import LayoutComponentWrapper from "./LayoutComponentWrapper.vue";

const SectionLayout = defineComponent({
  name: "SectionLayout",
  components: {
    DispatchRenderer,
    LayoutComponentWrapper,
  },
  props: {
    ...rendererProps(),
  },
  setup(props) {
    return useJsonFormsLayout(props);
  },
});
export default SectionLayout;
</script>

<template>
  <LayoutComponentWrapper :layout="layout">
    <div class="section">
      <div class="section-header">
        <h3>{{ layout.uischema.label }}</h3>
      </div>

      <div class="section-elements">
        <DispatchRenderer
          v-for="(element, index) in layout.uischema.elements"
          :key="`${layout.path}-${index}`"
          :schema="layout.schema"
          :uischema="element"
          :path="layout.path"
          :enabled="layout.enabled"
          :renderers="layout.renderers"
          :cells="layout.cells"
        />
      </div>
    </div>
  </LayoutComponentWrapper>
</template>

<style lang="postcss" scoped>
.section {
  margin-bottom: 30px;

  & .section-header {
    position: sticky;
    top: 0;
    background-color: var(--knime-gray-ultra-light);
    z-index: 1;
    margin: 0 calc(-1 * var(--horizontal-dialog-padding));

    & h3 {
      margin: 0 var(--horizontal-dialog-padding) 20px;
      border-bottom: 1px solid var(--knime-silver-sand);
      color: var(--knime-masala);
      font-size: 16px;
      line-height: 40px;
    }
  }

  & .section-elements {
    display: flex;
    flex-direction: column;
    gap: 20px;

    & > *:last-child > :deep(*) {
      margin-bottom: 0;
    }
  }
}
</style>
