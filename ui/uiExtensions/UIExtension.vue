<script lang="ts">
import UIExtShadowApp from "./UIExtShadowApp.vue";
import UIExtIFrame from "./UIExtIFrame.vue";
import AlertLocal from "./AlertLocal.vue";
import WarningLocal from "./WarningLocal.vue";
import {
  AlertType,
  type Alert,
  type UIExtensionPushEvents,
} from "@knime/ui-extension-service";
import type { PropType } from "vue";
import { toRaw } from "vue";
import type { UIExtensionAPILayer } from "./types/UIExtensionAPILayer";
import type { ExtensionConfig } from "./types/ExtensionConfig";
import { toServiceAPILayer } from "./toServiceAPILayer";
/**
 * Wrapper for all UIExtensions. Determines the type of component to render (either native/Vue-based or iframe-based).
 * Also detects changes to it's configuration and increments a local counter to help with re-renders of iframe-based
 * components.
 */
export default {
  components: {
    UIExtShadowApp,
    UIExtIFrame,
    AlertLocal,
    WarningLocal,
  },
  props: {
    apiLayer: {
      required: true,
      type: Object as PropType<UIExtensionAPILayer>,
    },
    extensionConfig: {
      required: true,
      type: Object as PropType<ExtensionConfig>,
    },
    settingsOnClean: {
      type: Object,
      required: false,
      default: null,
    },
    resourceLocation: {
      required: true,
      type: String,
    },
    isReporting: {
      default: false,
      type: Boolean,
    },
    isDialogLayout: {
      default: false,
      type: Boolean,
    },
  },
  data() {
    return {
      configKey: 0,
      alert: null as null | Alert,
      deregisterOldService: null as null | (() => void),
    };
  },
  computed: {
    isUIExtShadowApp() {
      return this.extensionConfig?.resourceInfo?.type === "SHADOW_APP";
    },
    displayError() {
      return this.alert?.type === "error" && !this.isReporting;
    },
    displayWarning() {
      return this.alert?.type === "warn" && !this.isReporting;
    },
    serviceAPILayer() {
      const setAlert = this.handleAlert.bind(this);
      return toServiceAPILayer(this.apiLayer, {
        config: {
          ...toRaw(this.extensionConfig),
          dialogSettings: toRaw(this.settingsOnClean),
        },
        setAlert,
      });
    },
  },
  watch: {
    extensionConfig() {
      this.deregisterOldService?.();
      this.configKey += 1; // needed to force a complete re-rendering
    },
  },
  beforeUnmount() {
    this.deregisterOldService?.();
  },
  mounted() {
    this.showMessageFromNodeInfo(this.extensionConfig.nodeInfo);
  },
  methods: {
    showMessageFromNodeInfo(nodeInfo: ExtensionConfig["nodeInfo"]) {
      const alertMessage =
        nodeInfo?.nodeErrorMessage ?? nodeInfo?.nodeWarnMessage;
      if (alertMessage) {
        const isError = nodeInfo?.nodeErrorMessage;
        const nodeId = this.extensionConfig.nodeId;
        this.handleAlert({
          message: alertMessage,
          type: isError ? AlertType.ERROR : AlertType.WARN,
          subtitle: "",
          nodeId,
        });
      }
    },
    onServiceCreated(service: {
      dispatchPushEvent: (event: UIExtensionPushEvents.PushEvent<any>) => void;
    }) {
      this.deregisterOldService =
        this.apiLayer.registerPushEventService(service);
    },
    handleAlert(alert: Alert) {
      if (this.isDialogLayout) {
        this.apiLayer.sendAlert(alert);
      } else {
        this.alert = alert;
      }
    },
    showAlert() {
      this.apiLayer.sendAlert(this.alert!, this.closeAlert);
    },
    closeAlert() {
      this.alert = null;
    },
  },
};
</script>

<template>
  <UIExtShadowApp
    v-if="isUIExtShadowApp"
    :key="`comp_${configKey}`"
    :api-layer="serviceAPILayer"
    :resource-location="resourceLocation"
    @service-created="onServiceCreated"
  />
  <UIExtIFrame
    v-else
    :key="`iframe_${configKey}`"
    :api-layer="serviceAPILayer"
    :resource-location="resourceLocation"
    @service-created="onServiceCreated"
  />
  <AlertLocal v-if="displayError" active @show-alert="showAlert" />
  <WarningLocal
    v-if="displayWarning"
    class="local-warning"
    @click="showAlert"
  />
</template>

<style lang="postcss" scoped>
.local-warning {
  position: absolute;
  bottom: 0;
  top: unset;
}
</style>
