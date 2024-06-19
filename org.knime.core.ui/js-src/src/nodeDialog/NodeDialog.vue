<script lang="ts">
import {
  JsonDataService,
  DialogService,
  UIExtensionService,
  AlertingService,
  CreateAlertParams,
  SharedDataService,
} from "@knime/ui-extension-service";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
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
import { inject, markRaw, ref } from "vue";
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
import useTriggers from "./composables/nodeDialog/useTriggers";
import useGlobalWatchers from "./composables/nodeDialog/useGlobalWatchers";
import { provideAndGetSetupMethod } from "./composables/nodeDialog/useDirtySettings";
import {
  createArrayAtPath,
  getArrayIdsRecord,
} from "./composables/nodeDialog/useArrayIds";
import useProvidedFlowVariablesMap from "./composables/components/useProvidedFlowVariablesMap";

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

export default {
  components: {
    JsonForms,
    Form,
  },
  inject: ["getKnimeService"],
  provide() {
    return {
      trigger: this.trigger,
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
      createArrayAtPath: (path: string) =>
        createArrayAtPath(getArrayIdsRecord(), path),
      setSubPanelExpanded: this.setSubPanelExpanded,
      getPanelsContainer: () => this.subPanels,
      getDialogPopoverTeleportDest: () => this.dialogPopoverTeleportDest,
    } satisfies ProvidedMethods & ProvidedForFlowVariables;
  },
  setup() {
    const getKnimeService =
      inject<() => UIExtensionService>("getKnimeService")!;
    const sendAlert = (params: CreateAlertParams) =>
      new AlertingService(getKnimeService()).sendAlert(params, true);
    const { addStateProviderListener, callStateProviderListener } =
      useStateProviders();
    const { registerWatcher, updateData, registeredWatchers } =
      useGlobalWatchers();
    const { registerTrigger, getTriggerCallback } = useTriggers();
    const { registerUpdates, resolveUpdateResults } = useUpdates({
      callStateProviderListener,
      registerTrigger,
      registerWatcher,
      updateData,
      sendAlert,
    });
    const { providedFlowVariablesMap, setInitialFlowVariablesMap } =
      useProvidedFlowVariablesMap();
    const { setRegisterSettingsMethod } = provideAndGetSetupMethod();
    const subPanels = ref<null | HTMLElement>(null);
    const dialogPopoverTeleportDest = ref<null | HTMLElement>(null);
    return {
      getKnimeService,
      sendAlert,
      addStateProviderListener,
      callStateProviderListener,
      registerUpdates,
      resolveUpdateResults,
      getTriggerCallback,
      updateDataInternal: updateData,
      registerWatcherInternal: registerWatcher,
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
      jsonDataService: null as JsonDataService | null,
      dialogService: null as DialogService | null,
      sharedDataService: null as SharedDataService | null,
      flawedControllingVariablePaths: new Set() satisfies Set<string>,
      possiblyFlawedControllingVariablePaths: new Set() satisfies Set<string>,
      renderers: Object.freeze(renderers),
      currentData: {} as SettingsData,
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
      },
      ready: false,
      isMetaKeyPressed: false,
    };
  },
  async mounted() {
    this.jsonDataService = new JsonDataService(this.getKnimeService());
    this.dialogService = new DialogService(this.getKnimeService());
    this.sharedDataService = new SharedDataService(this.getKnimeService());
    const initialSettings = await this.jsonDataService.initialData();
    const { schema } = initialSettings;
    schema.flowVariablesMap = this.initializeFlowVariablesMap(initialSettings);
    this.setInitialFlowVariablesMap(schema.flowVariablesMap);
    schema.hasNodeView = this.dialogService.hasNodeView();
    schema.showAdvancedSettings = false;
    this.schema = schema;
    this.uischema = initialSettings.ui_schema;
    this.currentData = initialSettings.data;
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
    async trigger(params: { id: string; indexIds?: string[] }) {
      this.currentData = await this.getTriggerCallback(params)(
        this.currentData,
      );
    },
    resolveInitialUpdates(initialUpdates: UpdateResult[]) {
      this.currentData = this.resolveUpdateResults(
        initialUpdates,
        this.currentData,
      );
    },
    async registerGlobalUpdates(globalUpdates: Update[]) {
      const initialTransformation = this.registerUpdates(globalUpdates);
      if (initialTransformation) {
        this.currentData = await initialTransformation(this.currentData);
      }
    },
    getData() {
      return {
        data: this.currentData,
        flowVariableSettings: this.providedFlowVariablesMap,
      };
    },
    publishSettings() {
      const publishedData = cloneDeep(this.getData());
      this.sharedDataService!.shareData(publishedData);
    },
    getModelSettings(data: SettingsData) {
      return data.model;
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
    /**
     * @param {string} path The path of the setting that is changed
     * @returns {void}
     */
    updateData(path: string) {
      return this.updateDataInternal(path, this.currentData);
    },
    async registerWatcher({
      transformSettings,
      init,
      dependencies,
    }: Parameters<ProvidedMethods["registerWatcher"]>[0]) {
      const removeWatcher = this.registerWatcherInternal({
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
        await init(this.currentData);
      }
      return removeWatcher;
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
        // We must not set this.currentData = data directly, as this would update the internal
        // data of the jsonforms component.
        Object.keys(data).forEach((key: string) => {
          this.currentData[key] = data[key];
        });
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
    <Form>
      <div ref="dialogPopoverTeleportDest" class="popover-container" />
      <JsonForms
        v-if="ready"
        ref="jsonforms"
        :data="markRaw(currentData)"
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
