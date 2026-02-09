<script setup lang="ts">
import { computed, ref, useId } from "vue";

import { KdsLabel } from "@knime/kds-components";

const props = defineProps<{
  label: string;
  hideControlHeader?: boolean;
  fill?: boolean;
  large?: boolean;
}>();
const hover = ref(false);
const labelForId = useId();

// An empty string will change the layout. In order to keep the layout we add
// a space here that will lead to the correct height of the control header.
// Hiding the whole header can be done by setting the hideControlHeader option
const title = computed(() => (props.label === "" ? " " : props.label));
</script>

<template>
  <slot v-if="hideControlHeader" label-for-id="" />
  <div
    v-else
    :class="['dialog-label', { fill }]"
    @mouseover="hover = true"
    @mouseleave="hover = false"
  >
    <div class="control-header">
      <div class="left">
        <slot name="before-label" />
        <KdsLabel
          :id="'label-' + labelForId"
          :for="labelForId"
          :label="title"
        />
        <slot name="icon" />
      </div>
      <slot name="buttons" :hover="hover" />
    </div>
    <slot :label-for-id="labelForId" />
  </div>
</template>

<style scoped>
.dialog-label {
  /**
  * This is necessary to fixate the dialog popovers
  */
  position: relative;
  display: flex;
  flex-direction: column;

  &.fill {
    flex-grow: 1;
  }

  & .control-header {
    display: flex;
    max-width: 100%;

    & .left {
      display: flex;
      flex: 1;
      justify-content: flex-start;
      min-width: 0;

      & .label {
        flex-shrink: 1;
        min-width: 0;
        white-space: pre;
      }

      /**
       * see src/uiComponents/composables/useHideOnNull.ts
       */
      & :deep(.checkbox-hide-on-null) {
        margin-right: var(--kds-spacing-container-0-37x);
      }
    }
  }

  & :deep(.label-text) {
    display: inline-block;
  }
}
</style>
