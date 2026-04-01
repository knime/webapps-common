<script setup lang="ts">
import { computed, defineAsyncComponent, isRef, ref } from "vue";
import type { JsonSchema } from "@jsonforms/core";

import { KdsButton, KdsDropdown } from "@knime/kds-components";

import { JsonFormsDialog, defaultRenderers } from "../src";

import { mocks } from "./mocks";
import type { MockSchema } from "./mocks";

const mockSchemas: MockSchema[] = mocks;
const selected = ref<MockSchema>(mocks[0]);

const schema = computed(() => {
  const s = selected.value?.schema;
  return (isRef(s) ? s.value : s) as JsonSchema;
});

function onSchemaSelect(id: string) {
  const found = mockSchemas.find((m) => m.id === id);
  if (found) {
    selected.value = found;
  }
}

function onFormChange({ data }: { data: unknown }) {
  // Sync form changes back to the mock's reactive data (for computed schemas)
  if (selected.value?.data && typeof data === "object" && data !== null) {
    Object.assign(selected.value.data, data);
  }
}

const forceLoading = ref(false);
function onForceLoading() {
  forceLoading.value = true;
  selected.value = {} as MockSchema;
}
const NeverLoadingComponent = defineAsyncComponent(() => {
  return new Promise(() => {});
});
</script>

<template>
  <div class="page">
    <div class="toolbar">
      <KdsDropdown
        :model-value="selected?.id"
        :possible-values="
          mockSchemas.map((mock) => ({ id: mock.id, text: mock.name }))
        "
        ariaLabel="Select a schema"
        placeholder="Select a schema"
        @update:model-value="onSchemaSelect"
      />
      <KdsButton
        label="Force loading state"
        size="xsmall"
        variant="outlined"
        @click="onForceLoading"
      />
    </div>

    <div class="dialog-wrapper">
      <JsonFormsDialog
        v-if="selected"
        :key="selected.name"
        :schema="schema"
        :uischema="selected.uischema"
        :data="selected.data"
        :renderers="defaultRenderers"
        @change="onFormChange"
      >
        <template #top>
          <NeverLoadingComponent v-if="forceLoading" />
        </template>
      </JsonFormsDialog>
      <p v-else class="placeholder">Select a schema to preview the form.</p>
    </div>
  </div>
</template>

<style lang="postcss">
@import url("@knime/styles/css");
@import url("../src/assets/main.css");
@import url("@knime/kds-styles/kds-variables.css");
@import url("@knime/kds-styles/kds-legacy-theme.css");
</style>

<style scoped>
.page {
  display: flex;
  flex-direction: column;
  gap: var(--kds-spacing-container-2x);
  align-items: center;
  min-height: 100vh;
  padding: var(--kds-spacing-container-2x) var(--kds-spacing-container-0-75x);
}

.toolbar {
  display: flex;
  gap: var(--kds-spacing-container-0-75x);
  align-items: center;
  font: var(--kds-font-base-body-small);
}

.toolbar select {
  padding: var(--kds-spacing-container-0-37x) var(--kds-spacing-container-0-75x);
  font: var(--kds-font-base-body-small);
  cursor: pointer;
  border: var(--kds-color-border-neutral);
  border-radius: var(--kds-border-radius-container-0-25x);
}

.dialog-wrapper {
  width: 100%;
  max-width: 480px;
  height: calc(90vh - 100px);
  padding: 0 var(--kds-spacing-container-0-75x);
  background: var(--kds-color-surface-default);
  border-radius: var(--kds-border-radius-container-0-37x);
  box-shadow: var(--kds-elevation-level-3);
}

.placeholder {
  padding: var(--kds-spacing-container-2x);
  font: var(--kds-font-base-body-small);
  color: var(--kds-color-text-and-icon-neutral);
  text-align: center;
}
</style>
