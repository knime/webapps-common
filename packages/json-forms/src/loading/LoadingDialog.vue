<!-- The component shown when resolving dynamic imports-->
<script setup lang="ts">
import { onMounted, ref } from "vue";
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
  <div v-if="afterDelay" class="loading-dialog skeleton-wrapper">
    <div class="loading-dialog-content skeleton" />
  </div>
</template>

<style lang="postcss" scoped>
/* TODO UIEXT-2167: Move skeleton to common repo */
@import url("./skeleton.css");

.loading-dialog {
  margin: var(--space-16);
  height: 100%;
}

.loading-dialog-content {
  flex-grow: 1;
}
</style>
