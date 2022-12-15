<script>
import { defineComponent } from '@vue/composition-api';
import { useJsonFormsLayout, rendererProps, DispatchRenderer } from '@jsonforms/vue2';

const SectionLayout = defineComponent({
    name: 'SectionLayout',
    components: {
        DispatchRenderer
    },
    props: {
        ...rendererProps()
    },
    setup(props) {
        return useJsonFormsLayout(props);
    },
    computed: {
        isVisible() {
            return this.layout.visible &&
                (this.layout.schema.showAdvancedSettings || !this.isAdvanced);
        },
        isAdvanced() {
            return this.layout.uischema.options?.isAdvanced;
        }
    }
});
export default SectionLayout;
</script>

<template>
  <div
    v-if="isVisible"
    class="section"
    :class="{fadeContainer: isAdvanced}"
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
</template>

<style lang="postcss" scoped>
@import "../../utils/animation.css";
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
