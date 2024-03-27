<script>
import { defineComponent } from "vue";
import {
  useJsonFormsLayout,
  rendererProps,
  DispatchRenderer,
} from "@jsonforms/vue";
import VerticalLayoutBase from "./VerticalLayoutBase.vue";

const VerticalLayout = defineComponent({
  name: "VerticalLayout",
  components: {
    DispatchRenderer,
    VerticalLayoutBase,
  },
  props: {
    ...rendererProps(),
  },
  setup(props) {
    return useJsonFormsLayout(props);
  },
});
export default VerticalLayout;
</script>

<template>
  <VerticalLayoutBase
    #default="{ element, index }"
    :elements="layout.uischema.elements"
  >
    <DispatchRenderer
      :key="`${layout.path}-${index}`"
      :schema="layout.schema"
      :uischema="element"
      :path="layout.path"
      :enabled="layout.enabled"
      :renderers="layout.renderers"
      :cells="layout.cells"
    />
  </VerticalLayoutBase>
</template>
