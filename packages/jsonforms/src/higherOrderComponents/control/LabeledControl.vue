<script setup lang="ts">
import { type Ref, computed, ref } from "vue";

import { Label } from "@knime/components";

const props = defineProps<{
  label: string;
  hideControlHeader?: boolean;
  fill?: boolean;
}>();
const hover = ref(false);
const labelForId: Ref<null | string> = ref("");

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
        <Label
          :text="title"
          class="label"
          compact
          @label-for-id="labelForId = $event"
        />
        <slot name="icon" />
      </div>
      <slot name="buttons" :hover="hover" />
    </div>
    <slot :label-for-id="labelForId" />
  </div>
</template>

<script setup lang="ts"></script>

<style scoped></style>

<style lang="postcss" scoped>
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
      min-width: 0;
      flex: 1;
      justify-content: flex-start;
      display: flex;

      & .label {
        min-width: 0;
        flex-shrink: 1;
        white-space: pre;
      }
    }
  }

  & :deep(.label-text) {
    display: inline-block;
  }
}
</style>
