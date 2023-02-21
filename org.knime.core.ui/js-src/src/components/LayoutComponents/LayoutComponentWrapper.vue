<script>
import { defineComponent } from 'vue';

const LayoutComponentWrapper = defineComponent({
    name: 'LayoutComponentWrapper',
    inject: ['jsonforms'],
    props: {
        layout: {
            type: Object,
            default: () => {}
        }
    },
    computed: {
        isVisible() {
            return this.layout.visible &&
                (this.rootSchema.showAdvancedSettings || !this.isAdvanced);
        },
        isAdvanced() {
            return this.layout.uischema.options?.isAdvanced;
        },
        rootSchema() {
            return this.jsonforms.core.schema;
        }
    }
});
export default LayoutComponentWrapper;
</script>

<template>
  <div
    v-if="isVisible"
    :class="{fadeContainer: isAdvanced}"
  >
    <slot />
  </div>
</template>

<style lang="postcss" scoped>
@import url("../../utils/animation.css");
</style>
