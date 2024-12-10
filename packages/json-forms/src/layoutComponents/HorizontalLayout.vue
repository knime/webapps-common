<script>
import { defineComponent } from "vue";
import {
  DispatchRenderer,
  rendererProps,
  useJsonFormsLayout,
} from "@jsonforms/vue";

import LayoutComponentWrapper from "./LayoutComponentWrapper.vue";

const HorizontalLayout = defineComponent({
  name: "HorizontalLayout",
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
export default HorizontalLayout;
</script>

<template>
  <LayoutComponentWrapper :layout="layout">
    <div class="horizontal">
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
  </LayoutComponentWrapper>
</template>

<style lang="postcss" scoped>
.horizontal {
  width: 100%;
  display: inline-flex;
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
