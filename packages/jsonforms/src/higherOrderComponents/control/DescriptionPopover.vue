<script setup lang="ts">
import { Description } from "@knime/components";
import { KdsInfoToggleButton } from "@knime/kds-components";

export type DescriptionPopoverProps = {
  html?: string;
  hover?: boolean;
};
const { hover = false } = defineProps<DescriptionPopoverProps>();
</script>

<template>
  <KdsInfoToggleButton :hidden="!hover">
    <div class="description-wrapper">
      <Description class="description" :text="html" render-as-html />
    </div>
  </KdsInfoToggleButton>
</template>

<style lang="postcss" scoped>
/** A deep selector is necessary, since Description is a multi-root component
* (see https://github.com/vuejs/core/issues/5446)
*/
.description-wrapper :deep(.description) {
  max-height: 300px;
  overflow: auto;
  font: var(--kds-font-base-body-small);
  pointer-events: auto;
}
</style>
