<script lang="ts">
import {
  UIExtensionService,
  CreateAlertParams,
} from "@knime/ui-extension-service";
import { JsonForms } from "@jsonforms/vue";
import Form from "./layoutComponents/Form.vue";
import "../common/main.css";
import { type JsonSchema, type UISchemaElement } from "@jsonforms/core";
import { fallbackRenderers, defaultRenderers } from "./renderers";
import {
  getPossibleValuesFromUiSchema,
  hasAdvancedOptions,
} from "../nodeDialog/utils";
import { cloneDeep } from "lodash-es";
import { inject, markRaw, nextTick, ref } from "vue";
import type ProvidedMethods from "./types/provided";
import type { ProvidedForFlowVariables } from "./types/provided";
import type SettingsData from "./types/SettingsData";
import type { Update, UpdateResult } from "./types/Update";
import type Control from "./types/Control";
import getChoices from "./api/getChoices";
import * as flowVariablesApi from "./api/flowVariables";
import type { FlowSettings } from "./api/types";

import useStateProviders from "./composables/nodeDialog/useStateProviders";
import useUpdates from "./composables/nodeDialog/useUpdates";
import useTriggers, {
  TriggerCallback,
} from "./composables/nodeDialog/useTriggers";
import useGlobalWatchers from "./composables/nodeDialog/useGlobalWatchers";
import { provideAndGetSetupMethod } from "./composables/nodeDialog/useDirtySettings";
import {
  createArrayAtPath,
  getArrayIdsRecord,
} from "./composables/nodeDialog/useArrayIds";
import useProvidedFlowVariablesMap from "./composables/components/useProvidedFlowVariablesMap";
import useCurrentData from "./composables/nodeDialog/useCurrentData";
import useServices from "./composables/nodeDialog/useServices";
import LoadingDialog from "./loading/LoadingDialog.vue";
import { PersistSchema } from "./types/Persist";

const renderers = [...fallbackRenderers, ...defaultRenderers];

export default {
  components: {
    JsonForms,
    LoadingDialog,
    Form,
  },
  inject: ["getKnimeService"],
  provide() {
    return {
      trigger: this.trigger,
      isTriggerActive: this.isTriggerActive,
      registerWatcher: this.registerWatcher,
      addStateProviderListener: this.addStateProviderListener,
      updateData: this.updateData,
      getData: this.callDataService,
      getPossibleValuesFromUiSchema: this.getPossibleValuesFromUiSchema,
      sendAlert: this.sendAlert,
      flowVariablesApi: {
        getAvailableFlowVariables: this.getAvailableFlowVariables,
        getFlowVariableOverrideValue: this.getFlowVariableOverrideValue,
        clearControllingFlowVariable: this.clearControllingFlowVariable,
      },
      getPersistSchema: this.getPersistSchema,
      createArrayAtPath: (path: string) =>
        createArrayAtPath(getArrayIdsRecord(), path),
      setSubPanelExpanded: this.setSubPanelExpanded,
      getPanelsContainer: () => this.subPanels,
      getDialogPopoverTeleportDest: () => this.dialogPopoverTeleportDest,
    } satisfies ProvidedMethods & ProvidedForFlowVariables;
  },
  setup() {
    const { setCurrentData, getCurrentData } = useCurrentData();
    const getKnimeService =
      inject<() => UIExtensionService>("getKnimeService")!;

    const {
      dialogService,
      jsonDataService,
      sharedDataService,
      alertingService,
    } = useServices(getKnimeService());

    const { providedFlowVariablesMap, setInitialFlowVariablesMap } =
      useProvidedFlowVariablesMap();

    const getData = () => ({
      data: getCurrentData(),
      flowVariableSettings: providedFlowVariablesMap,
    });

    const publishSettings = () => {
      const publishedData = cloneDeep(getData());
      sharedDataService!.shareData(publishedData);
    };

    const sendAlert = (params: CreateAlertParams) =>
      alertingService.sendAlert(params, true);
    const {
      addStateProviderListener,
      callStateProviderListener,
      callStateProviderListenerByIndices,
    } = useStateProviders();
    const {
      registerWatcher: registerWatcherInternal,
      updateData: updateDataInternal,
      updateDataMultiplePaths: updateDataMultiplePathsInternal,
      registeredWatchers,
    } = useGlobalWatchers();

    // WATCHERS
    const registerWatcher = async ({
      transformSettings,
      init,
      dependencies,
    }: Parameters<ProvidedMethods["registerWatcher"]>[0]) => {
      const removeWatcher = registerWatcherInternal({
        transformSettings: () => async (dependencyData) => {
          const settingsConsumer = await transformSettings(dependencyData);
          return (newSettings) => {
            settingsConsumer?.(newSettings);
            return newSettings;
          };
        },
        dependencies: dependencies.map((dep) => [dep]),
      });
      if (typeof init === "function") {
        await init(getCurrentData());
      }
      return removeWatcher;
    };
    const updateData = (path: string) =>
      updateDataInternal(path, getCurrentData());
    const updateDataMultiplePaths = (paths: string[]) =>
      updateDataMultiplePathsInternal(paths, getCurrentData());

    // TRIGGERS
    const { registerTrigger, getTriggerCallback, getTriggerIsActiveCallback } =
      useTriggers();

    /**
     * We need to use getCurrentData() twice when running triggers:
     * Once for setting the dependencies and once the transformation is to be performed on them.
     * The settings might have changed in the meantime.
     */
    const runWithDependencies = async (
      triggerCallback: ReturnType<TriggerCallback>,
    ) => (await triggerCallback(getCurrentData()))(getCurrentData());

    const trigger = (params: { id: string; indexIds?: string[] }) =>
      runWithDependencies(getTriggerCallback(params));
    const isTriggerActive = (params: { id: string; indexIds?: string[] }) =>
      getTriggerIsActiveCallback(params)(getCurrentData());
    // UPDATES
    const { registerUpdates, resolveUpdateResults } = useUpdates({
      callStateProviderListener,
      callStateProviderListenerByIndices,
      registerTrigger,
      registerWatcher: registerWatcherInternal,
      updateData: updateDataMultiplePaths,
      sendAlert,
      publishSettings,
    });
    const resolveInitialUpdates = (initialUpdates: UpdateResult[]) =>
      resolveUpdateResults(initialUpdates, getCurrentData());
    const registerGlobalUpdates = (globalUpdates: Update[]) => {
      const initialTransformation = registerUpdates(globalUpdates);
      if (initialTransformation) {
        // we need to wait for the next tick to ensure that array items are already rendered and have an _id
        nextTick(() => {
          runWithDependencies(initialTransformation);
        });
      }
    };

    const { setRegisterSettingsMethod } = provideAndGetSetupMethod();
    const subPanels = ref<null | HTMLElement>(null);
    const dialogPopoverTeleportDest = ref<null | HTMLElement>(null);
    return {
      setCurrentData,
      getCurrentData,
      jsonDataService,
      sharedDataService,
      dialogService,
      getData,
      publishSettings,
      sendAlert,
      addStateProviderListener,
      callStateProviderListener,
      registerUpdates,
      resolveUpdateResults,
      getTriggerCallback,
      updateData,
      trigger,
      isTriggerActive,
      resolveInitialUpdates,
      registerGlobalUpdates,
      registerWatcher,
      registeredWatchers,
      setRegisterSettingsMethod,
      subPanels,
      providedFlowVariablesMap,
      setInitialFlowVariablesMap,
      dialogPopoverTeleportDest,
    };
  },
  data() {
    return {
      flawedControllingVariablePaths: new Set() satisfies Set<string>,
      possiblyFlawedControllingVariablePaths: new Set() satisfies Set<string>,
      renderers: Object.freeze(renderers),
      schema: {} as JsonSchema & {
        showAdvancedSettings: boolean;
        flowVariablesMap: Record<string, FlowSettings>;
      },
      uischema: {} as UISchemaElement & {
        /**
         * Data defining the value updates from dependencies to targets
         */
        globalUpdates?: Update[];
        /**
         * Data defining values that have been computed while opening the dialog
         */
        initialUpdates?: UpdateResult[];
        /**
         * Information on the persist structure used to map flow variables to controls.
         */
        persist: PersistSchema;
      },
      ready: false,
      isMetaKeyPressed: false,
    };
  },
  async mounted() {
    const initialSettings = await this.jsonDataService.initialData();
    const { schema } = initialSettings;
    schema.flowVariablesMap = this.initializeFlowVariablesMap(initialSettings);
    this.setInitialFlowVariablesMap(schema.flowVariablesMap);
    schema.hasNodeView = this.dialogService.hasNodeView();
    schema.showAdvancedSettings = false;
    this.schema = schema;
    this.uischema = initialSettings.ui_schema;
    this.setCurrentData(initialSettings.data);
    this.setRegisterSettingsMethod(
      this.dialogService.registerSettings.bind(this.dialogService),
    );
    this.resolveInitialUpdates(this.uischema?.initialUpdates ?? []);
    this.registerGlobalUpdates(this.uischema?.globalUpdates ?? []);
    this.dialogService.setApplyListener(this.applySettings.bind(this));
    this.ready = true;
  },
  methods: {
    setSubPanelExpanded({ isExpanded }: { isExpanded: boolean }) {
      this.dialogService?.setControlsVisibility({
        shouldBeVisible: !isExpanded,
      });
    },
    getPersistSchema() {
      return this.uischema.persist;
    },
    callDataService({
      method,
      options,
    }: Parameters<ProvidedMethods["getData"]>[0]) {
      return this.jsonDataService?.data({ method, options })!;
    },
    getPossibleValuesFromUiSchema(control: Control) {
      return getPossibleValuesFromUiSchema(
        control,
        getChoices(this.callDataService.bind(this)),
        this.sendAlert.bind(this),
      );
    },
    getAvailableFlowVariables(persistPath: string) {
      return flowVariablesApi.getAvailableFlowVariables(
        this.callDataService.bind(this),
        persistPath,
        this.getData(),
      );
    },
    initializeFlowVariablesMap({
      flowVariableSettings,
    }: {
      flowVariableSettings: Record<string, FlowSettings>;
    }) {
      Object.keys(flowVariableSettings).forEach((persistPath) => {
        if (flowVariableSettings[persistPath].controllingFlowVariableName) {
          this.possiblyFlawedControllingVariablePaths.add(persistPath);
          /**
           * The variable could be valid again since the last time it has been applied.
           */
          delete flowVariableSettings[persistPath]
            .controllingFlowVariableFlawed;
        }
      });
      return flowVariableSettings;
    },
    async getFlowVariableOverrideValue(persistPath: string, dataPath: string) {
      const { data, flowVariableSettings } = cloneDeep(this.getData());
      [
        ...this.flawedControllingVariablePaths,
        ...this.possiblyFlawedControllingVariablePaths,
      ].forEach((path) => {
        if (path !== persistPath) {
          delete flowVariableSettings[path];
        }
      });
      const overrideValue = await flowVariablesApi.getFlowVariableOverrideValue(
        this.callDataService.bind(this),
        dataPath,
        { data, flowVariableSettings },
      );
      const valid = typeof overrideValue !== "undefined";
      const flowSettings = this.providedFlowVariablesMap[persistPath];
      if (flowSettings) {
        if (valid) {
          delete flowSettings.controllingFlowVariableFlawed;
        } else {
          flowSettings.controllingFlowVariableFlawed = true;
        }
      }
      this.flawedControllingVariablePaths[valid ? "delete" : "add"](
        persistPath,
      );
      this.possiblyFlawedControllingVariablePaths.delete(persistPath);
      return overrideValue;
    },
    clearControllingFlowVariable(persistPath: string) {
      this.flawedControllingVariablePaths.delete(persistPath);
      this.possiblyFlawedControllingVariablePaths.delete(persistPath);
    },
    onSettingsChanged({ data }: { data: SettingsData }) {
      if (data) {
        this.setCurrentData(data);
        this.publishSettings();
      }
    },
    async applySettings() {
      const { result } = await this.jsonDataService!.applyData(this.getData());
      if (result) {
        alert(result);
        return { isApplied: false };
      }
      return { isApplied: true };
    },
    changeAdvancedSettings() {
      if (this.schema === null) {
        return;
      }
      this.schema.showAdvancedSettings = !this.schema.showAdvancedSettings;
    },
    hasAdvancedOptions() {
      if (!this.uischema) {
        return false;
      }
      return hasAdvancedOptions(this.uischema);
    },
    markRaw,
  },
};
</script>

<template>
  <div class="dialog">
    <div ref="subPanels" />
    <Suspense v-if="ready">
      <Form>
        <div ref="dialogPopoverTeleportDest" class="popover-container" />
        <JsonForms
          ref="jsonforms"
          :data="getCurrentData()"
          :schema="schema"
          :uischema="uischema"
          :renderers="renderers"
          @change="onSettingsChanged"
        />
        <a
          v-if="hasAdvancedOptions()"
          class="advanced-options"
          @click="changeAdvancedSettings"
        >
          {{ schema.showAdvancedSettings ? "Hide" : "Show" }} advanced settings
        </a>
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

  & .popover-container {
    position: relative;
    width: 100%;
  }

  & .advanced-options {
    display: flex;
    justify-content: space-between;
    text-decoration: underline;
    margin-top: var(--space-32);
    font-size: 13px;
    cursor: pointer;
    color: var(--knime-dove-gray);

    &:hover {
      color: var(--knime-masala);
      text-decoration: underline dotted;
    }
  }
}
</style>
