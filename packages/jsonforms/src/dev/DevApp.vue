<script lang="ts">
/* eslint-disable no-console */
import {
  type Alert,
  type DataValueViewConfig,
  ExtensionTypes,
  RenderingType,
  UIExtensionPushEvents,
  type UIExtensionService,
} from "@knime/ui-extension-service";

import NodeDialog from "../NodeDialog.vue";

import dataServiceMock from "./dataServiceMock";

export default {
  components: {
    NodeDialog,
  },
  provide() {
    // load default page mock
    if (localStorage && localStorage.dialogIdx) {
      this.currentDialogIndex = Number(localStorage.getItem("dialogIdx"));
    }
    this.currentKS = this.getMockBaseService();
    return {
      getKnimeService: () => this.currentKS,
    };
  },
  data() {
    return {
      currentDialogIndex: 0,
      delay: 500,
      currentKS: null as null | UIExtensionService,
    };
  },
  computed: {
    dialogMocks() {
      // @ts-ignore
      const mocks: Record<string, { result: object }> = import.meta.glob(
        "@@/mocks/*.json",
        { eager: true },
      );
      return Object.keys(mocks)
        .sort()
        .map((file) => {
          return {
            name: file.replace("/mocks/", ""),
            config: {
              ...mocks[file],
              result: {
                flowVariableSettings: {},
                ...mocks[file].result,
              } as any,
            },
          };
        });
    },
    currentDialog() {
      return this.dialogMocks[this.currentDialogIndex]?.config;
    },
  },
  watch: {
    currentDialogIndex(newIdx, oldIdx) {
      if (newIdx === oldIdx) {
        return;
      }
      localStorage.setItem("dialogIdx", newIdx);
      this.currentKS = this.getMockBaseService();
    },
  },
  created() {
    // load default page mock
    if (localStorage && localStorage.dialogIdx) {
      this.currentDialogIndex = Number(localStorage.getItem("dialogIdx"));
    }
  },
  methods: {
    getMockBaseService(): UIExtensionService {
      let initialData = JSON.stringify(this.currentDialog);
      let extensionConfig = {
        initialData,
        nodeId: "0",
        workflowId: "0",
        projectId: "7",
        flowVariableSettings: {
          modelVariables: this.currentDialog.result.schema.flowVariablesMap,
          viewVariables: this.currentDialog.result.schema.flowVariablesMap,
        },
        nodeInfo: {
          nodeState: "executed",
          nodeName: "DevApp",
        },
        hasNodeView: false,
        extensionType: ExtensionTypes.DIALOG,
        renderingConfig: {
          type: RenderingType.DEFAULT,
        },
      };
      return {
        callNodeDataService: (params) => {
          console.log("callNodeDataService called");
          const rpcRequest = JSON.parse(params.dataServiceRequest);
          const result = dataServiceMock(rpcRequest);
          return new Promise((resolve) =>
            setTimeout(() => resolve({ result: { result } }), this.delay),
          );
        },
        addPushEventListener: (name: UIExtensionPushEvents.EventType) => {
          console.log(`Push event listener added for event ${name}`);
          return () => {};
        },
        getConfig() {
          return extensionConfig;
        },
        getResourceLocation() {
          console.log("getResourceLocation called");
          return Promise.resolve("Dummy resource location");
        },
        imageGenerated() {
          console.log("imageGenerated called");
        },
        publishData(data: any) {
          console.log("publishData called with", data);
        },
        sendAlert(alert: Alert) {
          console.log("alert sent: ", alert);
        },
        setReportingContent() {
          console.log("setReportingContent called");
        },
        onApplied() {
          console.log("onApplied called");
        },
        onDirtyStateChange(dirtyState) {
          console.log("onDirtyStateChange called with", dirtyState);
        },
        updateDataPointSelection() {
          console.log("updateDataPointSelection called");
          return Promise.resolve();
        },
        setControlsVisibility(param) {
          console.log("setControlsVisibility called with", param);
          return Promise.resolve();
        },
        showDataValueView(config: DataValueViewConfig) {
          console.log("showDataValueView called with", config);
        },
        closeDataValueView() {
          console.log("closeDataValueView called");
        },
      };
    },
    onDialogSelect(e: any) {
      let dialogIdx = e.target.selectedOptions[0].index - 1;
      this.currentDialogIndex = dialogIdx;
    },
    applySettings() {
      let message = "Current dialog does not have an apply data method.";
      if (typeof (this.currentKS as any)?.dataGetter === "function") {
        message = `Dialog returned value: \n${JSON.stringify(
          (this.currentKS as any)?.dataGetter(),
        )}`;
      }
      // eslint-disable-next-line no-console
      console.log(message);
    },
  },
};
</script>

<template>
  <div class="container">
    <h1>UI Extension based KNIME Node Dialog Dev App</h1>
    <p>
      Dialog mock:
      <select @change="onDialogSelect">
        <option :value="null">-</option>
        <option
          v-for="(dialog, index) in dialogMocks"
          :key="dialog.name"
          :value="dialog.name"
          :selected="index === currentDialogIndex"
        >
          {{ dialog.name }}
        </option>
      </select>
    </p>
    <div class="frame">
      <NodeDialog
        v-if="currentDialog && currentKS"
        :key="currentDialog.result.name"
      />
    </div>
    <span
      >Delay of backend calls: <input v-model="delay" type="number" /> ms</span
    >
    <button @click="applySettings">Simulate Apply (prints to console)</button>
  </div>
</template>

<style lang="postcss">
@import url("@knime/styles/css");

body {
  margin: 10px;
  font-size: 16px;
  line-height: 1.15;
}

.container {
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
}

.frame {
  position: relative;
  border: 5px solid orange;
  max-width: 400px;
  min-width: 340px;
  height: 600px;
  overflow-y: auto;
}
</style>
