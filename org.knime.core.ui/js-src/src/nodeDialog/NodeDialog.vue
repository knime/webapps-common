<script lang="ts">
import {
  JsonDataService,
  DialogService,
  KnimeService,
} from "@knime/ui-extension-service";
import { vanillaRenderers } from "@jsonforms/vue-vanilla";
import { JsonForms } from "@jsonforms/vue";
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
import { cloneDeep, set, isEqual } from "lodash";
import { inject, markRaw } from "vue";
import type ProvidedMethods from "./types/provided";
import type SettingsData from "./types/SettingsData";
import type Control from "./types/Control";
import getChoices from "./api/getChoices";
import * as flowVariablesApi from "./api/flowVariables";
import type { FlowSettings } from "./api/types";

const renderers = [
  ...vanillaRenderers,
  ...fallbackRenderers,
  ...defaultRenderers,
];

declare global {
  export interface Window {
    closeCEFWindow: Function;
  }
}

type RegisteredWatcher = {
  dataPaths: string[];
  transformSettings: (newData: SettingsData) => void;
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
      },
    } as ProvidedMethods;
  },
  setup() {
    return { getKnimeService: inject<() => KnimeService>("getKnimeService")! };
  },
  data() {
    return {
      jsonDataService: null as JsonDataService | null,
      dialogService: null as DialogService | null,
      originalModelSettings: null as any,
      renderers: Object.freeze(renderers),
      registeredWatchers: [] as RegisteredWatcher[],
      currentData: {} as SettingsData,
      schema: {} as JsonSchema & {
        showAdvancedSettings: boolean;
        flowVariablesMap: Record<string, FlowSettings>;
      },
      uischema: {} as UISchemaElement,
      ready: false,
    };
  },
  // TODO: UIEXT-236 Move to dialog service
  computed: {
    dirtyModelSettings(): boolean {
      // @ts-ignore
      return this.$store.state["pagebuilder/dialog"].dirtyModelSettings;
    },
  },
  async mounted() {
    this.jsonDataService = new JsonDataService(this.getKnimeService());
    this.dialogService = new DialogService(this.getKnimeService());
    const initialSettings = await this.jsonDataService.initialData();
    const { schema } = initialSettings;
    schema.flowVariablesMap = initialSettings.flowVariableSettings;
    schema.hasNodeView = this.dialogService.hasNodeView();
    schema.showAdvancedSettings = false;
    this.schema = schema;
    this.uischema = initialSettings.ui_schema;
    this.currentData = initialSettings.data;
    this.setOriginalModelSettings(this.currentData);
    this.jsonDataService.registerDataGetter(this.getData);
    // @ts-ignore
    this.$store.dispatch("pagebuilder/dialog/setApplySettings", {
      applySettings: this.applySettings,
    });
    this.ready = true;
  },
  methods: {
    getData() {
      return {
        data: this.currentData,
        flowVariableSettings: this.schema.flowVariablesMap,
      };
    },
    publishData() {
      const publishedData = cloneDeep(this.getData());
      this.jsonDataService!.publishData(publishedData);
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
    sendAlert({ type, message }: Parameters<ProvidedMethods["sendAlert"]>[0]) {
      const knimeService = this.getKnimeService();
      knimeService.sendWarning(knimeService.createAlert({ type, message }));
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
      this.registeredWatchers.push({
        transformSettings,
        dataPaths: dependencies.map(toDataPath),
      });
      if (typeof init === "function") {
        await init(this.currentData);
      }
    },
    getAvailableFlowVariables(persistPath: string) {
      return flowVariablesApi.getAvailableFlowVariables(
        this.callDataService.bind(this),
        persistPath,
        this.getData(),
      );
    },
    getFlowVariableOverrideValue(dataPath: string) {
      return flowVariablesApi.getFlowVariableOverrideValue(
        this.callDataService.bind(this),
        dataPath,
        this.getData(),
      );
    },
    onSettingsChanged({ data }: { data: SettingsData }) {
      if (data) {
        // We must not set this.currentData = data directly, as this would update the internal
        // data of the jsonforms component.
        Object.keys(data).forEach((key: string) => {
          this.currentData[key] = data[key];
        });
        if (this.hasOriginalModelSettings(this.currentData)) {
          // @ts-ignore
          this.$store.dispatch(
            "pagebuilder/dialog/cleanSettings",
            cloneDeep(this.currentData),
          );
        }
        // TODO: UIEXT-236 Move to dialog service
        if (!this.dirtyModelSettings) {
          this.publishData();
        }
      }
    },
    applySettings() {
      this.setOriginalModelSettings(this.currentData);
      return this.jsonDataService!.applyData();
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
      window.closeCEFWindow();
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
    <div class="controls">
      <Button with-border compact @click="closeDialog"> Cancel</Button>
      <Button primary compact @click.prevent="applySettingsCloseDialog">
        Ok
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
  border-left: 1px solid var(--knime-silver-sand);
  padding: 11px 0; /* Padding set at 11px to align with the commons "Messages" component */

  & .form {
    display: flex;
    flex-direction: column;
    height: calc(100vh - var(--controls-height));
    padding: 0 20px;
    overflow: hidden;
    overflow-y: auto;

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
    padding: 13px 20px 5px;
    background-color: var(--knime-gray-light-semi);
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
