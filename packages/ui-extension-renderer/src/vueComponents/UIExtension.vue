<script setup lang="ts">
import {
  type StyleValue,
  computed,
  onMounted,
  onUnmounted,
  ref,
  toRaw,
  toRef,
  watch,
} from "vue";

import UIExtIFrame from "./UIExtIFrame.vue";
import UIExtShadowApp from "./UIExtShadowApp.vue";
import { type EventType, type PushEvent } from "./types";
import type { ExtensionConfig } from "./types/ExtensionConfig";
import type { UIExtensionAPILayer } from "./types/UIExtensionAPILayer";

/**
 * Wrapper for all UIExtensions. Determines the type of component to render (either native/Vue-based or iframe-based).
 * Also detects changes to it's configuration and increments a local counter to help with re-renders of iframe-based
 * components.
 */

type Props = {
  apiLayer: UIExtensionAPILayer;
  extensionConfig: ExtensionConfig;
  resourceLocation: string;
  /**
   * See ExtensionConfig.initialSharedData
   */
  initialSharedData?: {
    result?: string | object;
    userError?: object;
    internalError?: object;
  };
  isReporting?: boolean;
  isDialogLayout?: boolean;
  shadowAppStyle?: StyleValue | null;
};

const props = withDefaults(defineProps<Props>(), {
  initialSharedData: () => ({}),
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
    initialSharedData: toRaw(props.initialSharedData),
  };

  return {
    ...props.apiLayer,
    getConfig: () => {
      return toRaw(config);
    },
  };
});

const onServiceCreated = (service: {
  dispatchPushEvent: (event: PushEvent<EventType>) => void;
}) => {
  deregisterOldService = props.apiLayer.registerPushEventService(
    service as {
      dispatchPushEvent: <T extends EventType>(event: PushEvent<T>) => void;
    },
  );
};

const showMessageFromNodeInfo = (nodeInfo: ExtensionConfig["nodeInfo"]) => {
  if (nodeInfo?.nodeErrorMessage) {
    props.apiLayer.sendAlert({
      message: nodeInfo.nodeErrorMessage,
      type: "error",
    });
  } else if (nodeInfo?.nodeWarnMessage) {
    props.apiLayer.sendAlert({
      warnings: [{ message: nodeInfo.nodeWarnMessage }],
      type: "warn",
    });
  }
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
</template>
