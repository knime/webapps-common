<script>
import { defineComponent } from '@vue/composition-api';
import { useJsonFormsLayout, rendererProps, DispatchRenderer } from '@jsonforms/vue2';
import LayoutComponenWrapper from './LayoutComponentWrapper.vue';

const HorizontalLayout = defineComponent({
    name: 'HorizontalLayout',
    components: {
        DispatchRenderer,
        LayoutComponenWrapper
    },
    props: {
        ...rendererProps()
    },
    setup(props) {
        return useJsonFormsLayout(props);
    }
});
export default HorizontalLayout;
</script>

<template>
  <LayoutComponenWrapper :layout="layout">
    <div class="horizontal">
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
  </LayoutComponenWrapper>
</template>

<style lang="postcss" scoped>
.horizontal {
  display: flex;
  justify-content: space-between;
}

.horizontal > * {
  flex: 1;
  margin-left: 5px;
}

.horizontal > *:first-child {
  margin-left: 0;
}

</style>
