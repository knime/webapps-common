<script lang="ts">
import {
  JsonDataService,
  DialogService,
  UIExtensionService,
  AlertingService,
  CloseService,
} from "@knime/ui-extension-service";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { JsonForms } from "@jsonforms/vue";
import "../common/main.css";
import {
  toDataPath,
  type JsonSchema,
  type UISchemaElement,
} from "@jsonforms/core";
import { fallbackRenderers, defaultRenderers } from "./renderers";
import {
  getPossibleValuesFromUiSchema,
  hasAdvancedOptions,
} from "../nodeDialog/utils";
import Button from "webapps-common/ui/components/Button.vue";
import { getMetaOrCtrlKey } from "webapps-common/util/navigator";
import { cloneDeep, set, isEqual } from "lodash-es";
import { inject, markRaw } from "vue";
import type ProvidedMethods from "./types/provided";
import type { ProvidedForFlowVariables } from "./types/provided";
import type SettingsData from "./types/SettingsData";
import type Control from "./types/Control";
import getChoices from "./api/getChoices";
import * as flowVariablesApi from "./api/flowVariables";
import type { FlowSettings } from "./api/types";
import { v4 as uuidv4 } from "uuid";

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

type RegisteredWatcher = {
  id: string;
  dataPaths: string[];
  transformSettings: (newData: SettingsData) => void;
};

const doIfBodyActive =
  (fn: (event: KeyboardEvent) => void) => (event: KeyboardEvent) => {
    if (event.target === document.body) {
      fn(event);
    }
  };

export default {
  components: {
    JsonForms,
    Button,
  },
  inject: ["getKnimeService"],
  provide() {
    return {
      registerWatcher: this.registerWatcher,
      updateData: this.updateData,
      getData: this.callDataService,
      getPossibleValuesFromUiSchema: this.getPossibleValuesFromUiSchema,
      sendAlert: this.sendAlert,
      flowVariablesApi: {
        getAvailableFlowVariables: this.getAvailableFlowVariables,
        getFlowVariableOverrideValue: this.getFlowVariableOverrideValue,
        clearControllingFlowVariable: this.clearControllingFlowVariable,
      },
      closeDialog: this.closeDialog,
      getFlowVariablesMap: () => this.schema.flowVariablesMap,
      setDirtyModelSettings: this.setDirtyModelSettings,
    } satisfies ProvidedMethods & ProvidedForFlowVariables;
  },
  setup() {
    return {
      getKnimeService: inject<() => UIExtensionService>("getKnimeService")!,
    };
  },
  data() {
    return {
      jsonDataService: null as JsonDataService | null,
      dialogService: null as DialogService | null,
      originalModelSettings: null as any,
      flawedControllingVariablePaths: new Set() satisfies Set<string>,
      possiblyFlawedControllingVariablePaths: new Set() satisfies Set<string>,
      renderers: Object.freeze(renderers),
      registeredWatchers: [] as RegisteredWatcher[],
      currentData: {} as SettingsData,
      schema: {} as JsonSchema & {
        showAdvancedSettings: boolean;
        flowVariablesMap: Record<string, FlowSettings>;
      },
      uischema: {} as UISchemaElement,
      ready: false,
      isWriteProtected: false,
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
    this.setOriginalModelSettings(this.currentData);
    this.dialogService.setApplyListener(this.applySettings.bind(this));
    this.isWriteProtected = this.dialogService.isWriteProtected();
    this.ready = true;
    window.addEventListener("keydown", doIfBodyActive(this.keyDown.bind(this)));
    window.addEventListener("keyup", doIfBodyActive(this.keyUp.bind(this)));
  },
  unmounted() {
    window.removeEventListener(
      "keydown",
      doIfBodyActive(this.keyDown.bind(this)),
    );
    window.removeEventListener("keyup", doIfBodyActive(this.keyUp.bind(this)));
  },
  methods: {
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
    setOriginalModelSettings(data: SettingsData) {
      this.originalModelSettings = this.getModelSettings(data);
    },
    hasOriginalModelSettings(data: SettingsData) {
      return isEqual(this.originalModelSettings, this.getModelSettings(data));
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
    async updateData(
      handleChange: (path: string, value: any) => any,
      path: string,
      data: any,
    ) {
      const startsWithPath = (dataPath: string) => {
        return path.startsWith(`${dataPath}.`);
      };

      const triggeredWatchers = this.registeredWatchers.filter(
        ({ dataPaths }) =>
          dataPaths.includes(path) || dataPaths.some(startsWithPath),
      );
      if (triggeredWatchers.length === 0) {
        handleChange(path, data);
        return;
      }
      const newData = cloneDeep(this.currentData);
      set(newData, path, data);
      for (const watcher of triggeredWatchers) {
        await watcher.transformSettings(newData);
      }
      handleChange("", newData);
    },
    async registerWatcher({
      transformSettings,
      init,
      dependencies,
    }: Parameters<ProvidedMethods["registerWatcher"]>[0]) {
      const registered = {
        id: uuidv4(),
        transformSettings,
        dataPaths: dependencies.map(toDataPath),
      };
      this.registeredWatchers.push(registered);
      if (typeof init === "function") {
        await init(this.currentData);
      }
      return () => {
        this.registeredWatchers = this.registeredWatchers.filter(
          (item) => item.id !== registered.id,
        );
      };
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
      if (valid) {
        if (flowSettings) {
          delete flowSettings.controllingFlowVariableFlawed;
        }
      } else {
        this.setDirtyModelSettings();
        if (flowSettings) {
          flowSettings.controllingFlowVariableFlawed = true;
        }
      }
      this.flawedControllingVariablePaths[valid ? "delete" : "add"](
        persistPath,
      );
      this.possiblyFlawedControllingVariablePaths.delete(persistPath);
      this.cleanIfNecessary();
      return overrideValue;
    },
    setDirtyModelSettings() {
      this.dialogService?.setDirtyModelSettings();
    },
    clearControllingFlowVariable(persistPath: string) {
      this.flawedControllingVariablePaths.delete(persistPath);
      this.possiblyFlawedControllingVariablePaths.delete(persistPath);
      this.cleanIfNecessary();
    },
    onSettingsChanged({ data }: { data: SettingsData }) {
      if (data) {
        // We must not set this.currentData = data directly, as this would update the internal
        // data of the jsonforms component.
        Object.keys(data).forEach((key: string) => {
          this.currentData[key] = data[key];
        });
        this.cleanIfNecessary();
        this.publishSettings();
      }
    },
    cleanIfNecessary() {
      if (
        this.hasOriginalModelSettings(this.currentData) &&
        this.flawedControllingVariablePaths.size === 0
      ) {
        this.dialogService?.setSettingsWithCleanModelSettings(
          cloneDeep(this.currentData),
        );
      }
    },
    applySettings() {
      this.setOriginalModelSettings(this.currentData);
      return this.jsonDataService!.applyData(this.getData());
    },
    async applySettingsCloseDialog() {
      const response = await this.applySettings();
      if (response.result) {
        alert(response.result);
      } else {
        this.closeDialog();
      }
    },
    closeDialog() {
      new CloseService(this.getKnimeService()).close(this.isMetaKeyPressed);
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
    keyDown(e: KeyboardEvent) {
      this.isMetaKeyPressed = e[getMetaOrCtrlKey()];
      if (e.defaultPrevented) {
        return;
      }
      if (e.key === "Enter") {
        this.applySettingsCloseDialog();
      }
      if (e.key === "Escape") {
        this.closeDialog();
      }
    },
    keyUp(e: KeyboardEvent) {
      this.isMetaKeyPressed = e[getMetaOrCtrlKey()];
    },
    markRaw,
  },
};
</script>

<template>
  <div class="dialog">
    <div class="form" :tabindex="-1" @keydown="keyDown" @keyup="keyUp">
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
    <div class="controls">
      <Button with-border compact @click="closeDialog"> Cancel</Button>
      <Button
        :disabled="isWriteProtected"
        primary
        compact
        @click.prevent="applySettingsCloseDialog"
      >
        {{ isMetaKeyPressed ? "Ok and Execute" : "Ok" }}
      </Button>
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
  height: 100vh;
  background-color: var(--knime-gray-ultra-light);
  padding-bottom: 11px; /* Padding set at 11px to align with the commons "Messages" component */

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

  & .controls {
    display: flex;
    justify-content: space-between;
    height: var(--controls-height);
    padding: 14px 20px 4px;
    background-color: var(--knime-gray-ultra-light);
    border-top: 1px solid var(--knime-silver-sand);
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
