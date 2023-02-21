<script>
import { defineComponent } from 'vue';
import { useJsonFormsLayout, rendererProps, DispatchRenderer } from '@jsonforms/vue';
import LayoutComponentWrapper from './LayoutComponentWrapper.vue';

const SectionLayout = defineComponent({
    name: 'SectionLayout',
    components: {
        DispatchRenderer,
        LayoutComponentWrapper
    },
    props: {
        ...rendererProps()
    },
    setup(props) {
        return useJsonFormsLayout(props);
    }
});
export default SectionLayout;
</script>

<template>
  <LayoutComponentWrapper :layout="layout">
    <div
      class="section"
    >
      <h3>{{ layout.uischema.label }}</h3>
      <div
        v-for="(element, index) in layout.uischema.elements"
        :key="`${layout.path}-${index}`"
      >
        <DispatchRenderer
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

  & h3 {
    margin: 0 0 20px;
    border-bottom: 1px solid var(--knime-silver-sand);
    color: var(--knime-masala);
    font-size: 16px;
    line-height: 40px;
    position: sticky;
    top: 0;
    background-color: var(--knime-gray-ultra-light);
    z-index: 1;
  }

  & > *:last-child > * {
    margin-bottom: 0;
  }
}
</style>
