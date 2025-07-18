<script setup lang="ts">
import { computed, nextTick, provide, ref, watch } from "vue";
import {
  Actions,
  type CoreActions,
  type JsonFormsCore,
  type JsonSchema,
  type UISchemaElement,
  UPDATE_DATA,
} from "@jsonforms/core";
import { JsonForms } from "@jsonforms/vue";

import type { NamedRenderer } from "./higherOrderComponents/types";
import Form from "./layoutComponents/Form.vue";
import { provideSideDrawerTeleportDest } from "./layoutComponents/settingsSubPanel/SettingsSubPanel.vue";
import LoadingDialog from "./loading/LoadingDialog.vue";
import type { AlertParams } from "./types/alert";
import type { Provided, StateProviderLocation } from "./types/provided";
import "./assets/main.css";

defineProps<{
  schema: JsonSchema;
  uischema: UISchemaElement;
  data: unknown;
  renderers: readonly NamedRenderer[];
}>();

const emit = defineEmits<{
  updateData: [path: string];
  trigger: [id: unknown];
  change: [{ data: unknown }];
  alert: [alert: AlertParams];
  stateProviderListener: [
    identifier: StateProviderLocation & { [key: string]: unknown },
    callback: (value: unknown) => void,
  ];
}>();

const exposedMethodSource = "EXPOSED_METHOD";
const updateDataMiddleware: (
  state: JsonFormsCore,
  action: CoreActions,
  defaultReducer: (state: JsonFormsCore, action: CoreActions) => JsonFormsCore,
) => JsonFormsCore = (state, action, defaultReducer) => {
  if (
    action.type === UPDATE_DATA &&
    // @ts-expect-error source doesn't exist on type object
    action.context?.source !== exposedMethodSource
  ) {
    setTimeout(() => nextTick(() => emit("updateData", action.path)));
  }
  return defaultReducer(state, action);
};

const onSettingsChanged = (changedData: { data: unknown }) => {
  emit("change", changedData);
};

// TODO UIEXT-1673 (to be resolved with UIEXT-1673)
// @ts-expect-error the parent component NodeDialog in knime-core-ui still provides "registerWatcher", ...
const provided: Provided = {
  trigger: (id) => emit("trigger", id),
  addStateProviderListener: (identifier, callback) =>
    emit("stateProviderListener", identifier, callback),
  sendAlert: (alert) => emit("alert", alert),
};

Object.entries(provided).forEach(([key, value]) => provide(key, value));

const jsonforms = ref<InstanceType<typeof JsonForms> | null>(null);
const toBeUpdatedBeforeJsonforms: { path: string; value: unknown }[] = [];

const dispatchUpdate = (path: string, value: unknown) => {
  jsonforms.value!.dispatch(
    Actions.update(path, () => value, {
      source: exposedMethodSource,
    }),
  );
};

const jsonFormsIsPresent = computed(() => jsonforms.value !== null);
watch(
  () => jsonFormsIsPresent.value,
  (isPresent) =>
    isPresent &&
    toBeUpdatedBeforeJsonforms.forEach(({ path, value }) =>
      dispatchUpdate(path, value),
    ),
);
defineExpose({
  updateData: (path: string, value: unknown) => {
    if (jsonforms.value) {
      dispatchUpdate(path, value);
    } else {
      toBeUpdatedBeforeJsonforms.push({ path, value });
    }
  },
});

const subPanelTeleportDest = ref<HTMLElement | null>(null);
provideSideDrawerTeleportDest(subPanelTeleportDest);
</script>

<template>
  <div class="dialog">
    <!-- Here so that the SettingsSubPanel can teleport somewhere sensible -->
    <div ref="subPanelTeleportDest" />
    <Suspense>
      <Form>
        <slot name="top" />
        <JsonForms
          ref="jsonforms"
          :data
          :schema
          :uischema
          :renderers
          :middleware="updateDataMiddleware"
          @change="onSettingsChanged"
        />
        <slot name="bottom" />
      </Form>
      <template #fallback><LoadingDialog /></template>
    </Suspense>
  </div>
</template>

<style lang="postcss" scoped>
.dialog {
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--knime-gray-ultra-light);
  height: 100%;

  /**
   * The settings subpanel does overflow for animation reasons
  */
  overflow-x: hidden;
  position: relative;
}
</style>
