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
import type Ajv from "ajv";

import type { NamedRenderer } from "./higherOrderComponents/types";
import Form from "./layoutComponents/Form.vue";
import { provideSideDrawerTeleportDest } from "./layoutComponents/settingsSubPanel/SettingsSubPanel.vue";
import LoadingDialog from "./loading/LoadingDialog.vue";
import type { AlertParams } from "./types/alert";
import type { Provided, StateProviderLocation } from "./types/provided";
import "./assets/main.css";

const {
  data,
  schema,
  uischema,
  renderers,
  ajv = undefined,
  validate = undefined,
} = defineProps<{
  schema: JsonSchema;
  uischema: UISchemaElement;
  data: unknown;
  renderers: readonly NamedRenderer[];
  /**
   * Optional AJV instance for JSON Schema validation.
   *
   * By default, JsonForms creates its own AJV instance internally, which uses `eval()`
   * to compile validation functions from JSON schemas. This can cause CSP (Content Security Policy)
   * violations in environments that restrict dynamic code execution with 'unsafe-eval'.
   */
  ajv?: Ajv;
  /**
   * Called by elements who have custom validation needs.
   * Calling this method on every value change (debounced) starts when the ui option
   * `validatorId` is provided with a non-`null` value  and stops when `null` is provided
   * as id. Also one call is issued when the `validatorId` is provided.
   *
   * @param id the id of the validator
   * @param data the current data to validate
   */
  validate?: (id: string, data: unknown) => Promise<string | null>;
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
  initialized: [];
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
  validate: (id, data) => {
    // Default implementation that always returns valid
    // Override by providing a custom implementation
    if (!validate) {
      throw new Error(
        `No validate function provided to JsonFormsDialog but validate called with arguments ${JSON.stringify(
          { id, data },
        )}`,
      );
    }
    return validate(id, data);
  },
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

let resolveJsonFormsIsPresent: () => void;
const jsonFormsIsPresentPromise = new Promise<void>((resolve) => {
  resolveJsonFormsIsPresent = resolve;
});

const setIsInitialized = watch(
  () => jsonFormsIsPresent.value,
  (isPresent) => {
    if (isPresent) {
      emit("initialized");
      setIsInitialized(); // unregister watcher
    }
  },
  { immediate: true },
);

watch(
  () => jsonFormsIsPresent.value,
  (isPresent) => {
    if (isPresent) {
      resolveJsonFormsIsPresent();
      toBeUpdatedBeforeJsonforms.forEach(({ path, value }) =>
        dispatchUpdate(path, value),
      );
    }
  },
);
defineExpose({
  updateData: async (path: string, value: unknown) => {
    if (jsonforms.value) {
      dispatchUpdate(path, value);
    } else {
      toBeUpdatedBeforeJsonforms.push({ path, value });
      await jsonFormsIsPresentPromise;
    }
  },
});

const subPanelTeleportDest = ref<HTMLElement | null>(null);
provideSideDrawerTeleportDest(subPanelTeleportDest);

const jsonFormsDialogBindings = computed(() => ({
  data,
  schema,
  uischema,
  renderers,
  middleware: updateDataMiddleware,
  ...(ajv ? { ajv } : {}),
}));
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
          v-bind="jsonFormsDialogBindings"
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
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  height: 100%;

  /**
   * The settings subpanel does overflow for animation reasons
  */
  overflow-x: hidden;
  background-color: var(--kds-color-surface-default);
}
</style>
