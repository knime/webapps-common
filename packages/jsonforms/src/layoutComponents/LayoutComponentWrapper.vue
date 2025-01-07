<script>
import { defineComponent } from "vue";

import { injectShowAdvancedSettings } from "../composables/components/useAdvancedSettings";

const LayoutComponentWrapper = defineComponent({
  name: "LayoutComponentWrapper",
  props: {
    layout: {
      type: Object,
      default: () => {},
    },
  },
  setup() {
    const showAdvancedSettings = injectShowAdvancedSettings();
    return { showAdvancedSettings };
  },
  computed: {
    isVisible() {
      return (
        this.layout.visible && (this.showAdvancedSettings || !this.isAdvanced)
      );
    },
    isAdvanced() {
      return this.layout.uischema.options?.isAdvanced;
    },
  },
});
export default LayoutComponentWrapper;
</script>

<template>
  <div v-if="isVisible" :class="{ fadeContainer: isAdvanced }">
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
@import url("../utils/animation.css");
</style>
