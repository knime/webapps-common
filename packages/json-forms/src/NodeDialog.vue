<script lang="ts">
import { inject, markRaw, nextTick, ref } from "vue";
import { type JsonSchema, type UISchemaElement } from "@jsonforms/core";
import { JsonForms } from "@jsonforms/vue";
import { cloneDeep } from "lodash-es";

import {
  AlertType,
  type UIExtensionService,
} from "@knime/ui-extension-service";

import * as flowVariablesApi from "./api/flowVariables";
import getChoices from "./api/getChoices";
import type { FlowSettings } from "./api/types";
import { useShowAdvancedSettings } from "./composables/components/useAdvancedSettings";
import { useHasNodeView } from "./composables/components/useHasNodeView";
import useProvidedFlowVariablesMap from "./composables/components/useProvidedFlowVariablesMap";
import {
  createArrayAtPath,
  getArrayIdsRecord,
} from "./composables/nodeDialog/useArrayIds";
import useCurrentData from "./composables/nodeDialog/useCurrentData";
import { provideAndGetSetupMethod } from "./composables/nodeDialog/useDirtySettings";
import useGlobalWatchers from "./composables/nodeDialog/useGlobalWatchers";
import useServices from "./composables/nodeDialog/useServices";
import useStateProviders from "./composables/nodeDialog/useStateProviders";
import useTriggers, {
  type TriggerCallback,
} from "./composables/nodeDialog/useTriggers";
import useUpdates from "./composables/nodeDialog/useUpdates";
import Form from "./layoutComponents/Form.vue";
import LoadingDialog from "./loading/LoadingDialog.vue";
import { defaultRenderers, fallbackRenderers } from "./renderers";
import type { Control } from "./types/Control";
import type { InitialData } from "./types/InitialData";
import type { PersistSchema } from "./types/Persist";
import type { SettingsData } from "./types/SettingsData";
import type { Update, UpdateResult } from "./types/Update";
import type { Provided, ProvidedForFlowVariables } from "./types/provided";
import { getPossibleValuesFromUiSchema, hasAdvancedOptions } from "./utils";
import { getConfigPaths } from "./utils/paths";
import "./assets/main.css";

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
    } satisfies Provided & ProvidedForFlowVariables;
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

    const sendAlert = alertingService.sendAlert.bind(alertingService);
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

    const persistSchema = ref<PersistSchema | null>(null);

    // WATCHERS
    const registerWatcher = async ({
      transformSettings,
      init,
      dependencies,
    }: Parameters<Provided["registerWatcher"]>[0]) => {
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

    const pathIsControlledByFlowVariable = (path: string) =>
      getConfigPaths({ path, persistSchema: persistSchema.value ?? {} })
        .flatMap(({ configPath, deprecatedConfigPaths }) => [
          configPath,
          ...deprecatedConfigPaths,
        ])
        .map((configPath) =>
          Boolean(
            providedFlowVariablesMap[configPath]?.controllingFlowVariableName,
          ),
        )
        .includes(true);

    const { registerUpdates, resolveUpdateResults } = useUpdates({
      callStateProviderListener,
      callStateProviderListenerByIndices,
      registerTrigger,
      registerWatcher: registerWatcherInternal,
      updateData: updateDataMultiplePaths,
      sendAlert,
      publishSettings,
      pathIsControlledByFlowVariable,
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

    const hasNodeView = useHasNodeView();
    const showAdvancedSettings = useShowAdvancedSettings();

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
      hasNodeView,
      showAdvancedSettings,
      persistSchema,
    };
  },
  data() {
    return {
      flawedControllingVariablePaths: new Set() satisfies Set<string>,
      possiblyFlawedControllingVariablePaths: new Set() satisfies Set<string>,
      renderers: Object.freeze(renderers),
      schema: {} as JsonSchema,
      uischema: {} as UISchemaElement,
      flowVariablesMap: {} as Record<string, FlowSettings>,
      ready: false,
      isMetaKeyPressed: false,
    };
  },
  async mounted() {
    const initialSettings =
      (await this.jsonDataService.initialData()) as InitialData;
    this.flowVariablesMap = this.initializeFlowVariablesMap(initialSettings);
    this.setInitialFlowVariablesMap(this.flowVariablesMap);
    this.hasNodeView = this.dialogService.hasNodeView();
    this.schema = initialSettings.schema;
    this.uischema = initialSettings.ui_schema;
    this.setCurrentData(initialSettings.data);
    this.setRegisterSettingsMethod(
      this.dialogService.registerSettings.bind(this.dialogService),
    );
    this.persistSchema = initialSettings.persist;
    this.resolveInitialUpdates(initialSettings.initialUpdates ?? []);
    this.registerGlobalUpdates(initialSettings.globalUpdates ?? []);
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
      return this.persistSchema ?? {};
    },
    callDataService({ method, options }: Parameters<Provided["getData"]>[0]) {
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
        this.sendAlert({ message: result, type: AlertType.ERROR });
        return { isApplied: false };
      }
      return { isApplied: true };
    },
    changeAdvancedSettings() {
      if (this.schema === null) {
        return;
      }
      this.showAdvancedSettings = !this.showAdvancedSettings;
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
          {{ showAdvancedSettings ? "Hide" : "Show" }} advanced settings
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
