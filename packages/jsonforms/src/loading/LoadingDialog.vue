<!-- The component shown when resolving dynamic imports-->
<script setup lang="ts">
import { onMounted, ref } from "vue";

import { KdsLoadingSkeleton } from "@knime/kds-components";

/**
 * The number of milliseconds to wait before showing the loading dialog.
 * Otherwise, the loading dialog would flash for a very short time.
 */
const LOADING_DIALOG_DELAY = 200;
const afterDelay = ref(false);
onMounted(() => {
  setTimeout(() => {
    afterDelay.value = true;
  }, LOADING_DIALOG_DELAY);
});
</script>

<template>
  <div v-if="afterDelay" class="loading-dialog">
    <KdsLoadingSkeleton variant="input-with-label" :repeat="3" />
    <div class="two-columns">
      <KdsLoadingSkeleton variant="input-with-label" />
      <KdsLoadingSkeleton variant="input-with-label" />
    </div>
    <KdsLoadingSkeleton variant="input-with-label" :repeat="3" />
  </div>
</template>

<style lang="postcss" scoped>
.loading-dialog {
  display: flex;
  flex-direction: column;
  gap: var(--kds-spacing-container-1x);
  height: 100%;
  padding: var(--kds-spacing-container-2x) var(--kds-spacing-container-1x);

  .two-columns {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: var(--kds-spacing-container-1x);
    margin-bottom: var(--kds-spacing-container-3x);
  }
}
</style>
