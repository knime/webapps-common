<script lang="ts">
import {
  JsonDataService,
  DialogService,
  UIExtensionService,
  AlertingService,
} from "@knime/ui-extension-service";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { JsonForms } from "@jsonforms/vue";
import "../common/main.css";
import { type JsonSchema, type UISchemaElement } from "@jsonforms/core";
import { fallbackRenderers, defaultRenderers } from "./renderers";
import {
  getPossibleValuesFromUiSchema,
  hasAdvancedOptions,
} from "../nodeDialog/utils";
import { cloneDeep } from "lodash-es";
import { inject, markRaw } from "vue";
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

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

export default {
  components: {
    JsonForms,
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
      getFlowVariablesMap: () => this.schema.flowVariablesMap,
    } satisfies ProvidedMethods & ProvidedForFlowVariables;
  },
  setup() {
    const { addStateProviderListener, callStateProviderListener } =
      useStateProviders();
    const { registerWatcher, updateData, registeredWatchers } =
      useGlobalWatchers();
    const { registerTrigger, getTriggerCallback } = useTriggers();
    const { registerUpdates, resolveUpdateResults } = useUpdates({
      callStateProviderListener,
      registerTrigger,
      registerWatcher,
    });
    const { setRegisterSettingsMethod } = provideAndGetSetupMethod();
    return {
      getKnimeService: inject<() => UIExtensionService>("getKnimeService")!,
      addStateProviderListener,
      callStateProviderListener,
      registerUpdates,
      resolveUpdateResults,
      getTriggerCallback,
      updateDataInternal: updateData,
      registerWatcherInternal: registerWatcher,
      registeredWatchers,
      setRegisterSettingsMethod,
    };
  },
  data() {
    return {
      jsonDataService: null as JsonDataService | null,
      dialogService: null as DialogService | null,
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
    const initialSettings = await this.jsonDataService.initialData();
    const { schema } = initialSettings;
    schema.flowVariablesMap = this.initializeFlowVariablesMap(initialSettings);
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
    async trigger(triggerId: string) {
      this.currentData = await this.getTriggerCallback(triggerId)(
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
        flowVariableSettings: this.schema.flowVariablesMap,
      };
    },
    publishSettings() {
      const publishedData = cloneDeep(this.getData());
      this.dialogService!.publishSettings(publishedData);
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
    sendAlert(params: Parameters<ProvidedMethods["sendAlert"]>[0]) {
      const knimeService = this.getKnimeService();
      const alertService = new AlertingService(knimeService);
      alertService.sendAlert(params, true);
    },
    /**
     * @param {Function} handleChange The handler function that is used to handle the change of a dialog setting
     * @param {string} path The path of the setting that is changed
     * @param {any} data The new data that should be stored at the path
     * @returns {void}
     */
    updateData(
      handleChange: (path: string, value: any) => any,
      path: string,
      data: any,
    ) {
      return this.updateDataInternal(
        handleChange,
        path,
        data,
        this.currentData,
      );
    },
    async registerWatcher({
      transformSettings,
      init,
      dependencies,
    }: Parameters<ProvidedMethods["registerWatcher"]>[0]) {
      const removeWatcher = this.registerWatcherInternal({
        transformSettings: async (newSettings) => {
          await transformSettings(newSettings);
          return newSettings;
        },
        dependencies,
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
      const flowSettings = this.schema.flowVariablesMap[persistPath];
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
    <div class="form">
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
    </div>
  </div>
</template>

<style lang="postcss" scoped>
.dialog {
  --controls-height: 49px;
  --description-button-size: 15px;

  display: flex;
  flex-direction: column;
  justify-content: space-between;
  background-color: var(--knime-gray-ultra-light);
  height: 100%;

  & .form {
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--controls-height));
    padding: 0 20px;
    overflow: hidden;
    overflow-y: auto;

    &:focus {
      outline: none;
    }

    /* if a dialog starts with a section header we don't need extra top padding, otherwise adding it here */
    &:not(
        :has(
            > .vertical-layout
              > .vertical-layout-item:first-child
              > div
              > .section:first-child
          )
      ) {
      padding-top: 11px;
    }

    /* TODO: UIEXT-1061 workaround to make the last dialog element fill the remaining height, used in RichTextInput */

    & .vertical-layout:last-child {
      display: flex;
      flex-direction: column;
      flex: 1;

      & :deep(.vertical-layout-item:last-child) {
        display: flex;
        flex-direction: column;
        flex: 1;
      }
    }
  }

  & .advanced-options {
    display: flex;
    justify-content: space-between;
    text-decoration: underline;
    margin-bottom: 20px;
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
