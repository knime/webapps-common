<script setup lang="ts">
import {
  computed,
  onUnmounted,
  ref,
  toRaw,
  type StyleValue,
  watch,
  toRef,
  onMounted,
} from "vue";

import UIExtShadowApp from "./UIExtShadowApp.vue";
import UIExtIFrame from "./UIExtIFrame.vue";

import type { UIExtensionAPILayer } from "./types/UIExtensionAPILayer";
import type { ExtensionConfig } from "./types/ExtensionConfig";
import {
  AlertType,
  type UIExtensionPushEvents,
} from "@knime/ui-extension-service";

/**
 * Wrapper for all UIExtensions. Determines the type of component to render (either native/Vue-based or iframe-based).
 * Also detects changes to it's configuration and increments a local counter to help with re-renders of iframe-based
 * components.
 */

type Props = {
  apiLayer: UIExtensionAPILayer;
  extensionConfig: ExtensionConfig;
  resourceLocation: string;
  settingsOnClean?: Record<string, unknown> | null; // TODO: better type?
  isReporting?: boolean;
  isDialogLayout?: boolean;
  shadowAppStyle?: StyleValue | null;
};

const props = withDefaults(defineProps<Props>(), {
  settingsOnClean: null,
  shadowAppStyle: null,
});

const configKey = ref(0);
let deregisterOldService: () => void;

const isUIExtShadowApp = computed(() => {
  return props.extensionConfig?.resourceInfo?.type === "SHADOW_APP";
});

const serviceAPILayer = computed(() => {
  const config = {
    ...toRaw(props.extensionConfig),
    dialogSettings: toRaw(props.settingsOnClean),
  };

  return {
    ...props.apiLayer,
    getConfig: () => {
      return toRaw(config);
    },
  };
});

const onServiceCreated = (service: {
  dispatchPushEvent: (event: UIExtensionPushEvents.PushEvent<any>) => void;
}) => {
  deregisterOldService = props.apiLayer.registerPushEventService(service);
};

const showMessageFromNodeInfo = (nodeInfo: ExtensionConfig["nodeInfo"]) => {
  const alertMessage = nodeInfo?.nodeErrorMessage ?? nodeInfo?.nodeWarnMessage;

  if (!alertMessage) {
    return;
  }

  const isError = nodeInfo?.nodeErrorMessage;
  const nodeId = props.extensionConfig.nodeId;

  props.apiLayer.sendAlert({
    message: alertMessage,
    type: isError ? AlertType.ERROR : AlertType.WARN,
    subtitle: "",
    nodeId,
  });
};

watch(toRef(props, "extensionConfig"), () => {
  deregisterOldService?.();
  configKey.value += 1; // needed to force a complete re-rendering
});

onMounted(() => {
  showMessageFromNodeInfo(props.extensionConfig.nodeInfo);
});

onUnmounted(() => {
  deregisterOldService?.();
});
</script>

<template>
  <UIExtShadowApp
    v-if="isUIExtShadowApp"
    :key="`comp_${configKey}`"
    :api-layer="serviceAPILayer"
    :style="shadowAppStyle"
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
  <!-- <UIExtensionErrorOverlay v-if="displayError" active @show-alert="showAlert" /> -->
  <!-- <WarningLocal
    v-if="displayWarning"
    class="local-warning"
    @click="showAlert"
  /> -->
</template>

<style lang="postcss" scoped>
.local-warning {
  position: absolute;
  bottom: 0;
  top: unset;
}
</style>
