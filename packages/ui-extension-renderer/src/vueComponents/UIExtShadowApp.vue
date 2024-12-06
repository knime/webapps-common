<script lang="ts" setup>
import { type StyleValue, markRaw, onMounted, ref } from "vue";

import { setUpEmbedderService } from "../logic/embedder";

import type {
  UIExtensionPushEvents,
  UIExtensionService,
  UIExtensionServiceAPILayer,
} from "./types";
import { useDynamicImport } from "./useDynamicImport";

const { dynamicImport } = useDynamicImport();

interface Props {
  resourceLocation: string;
  apiLayer: UIExtensionServiceAPILayer;
  style?: StyleValue;
}
const props = withDefaults(defineProps<Props>(), {
  style: null,
});

const emit = defineEmits<{
  serviceCreated: [
    _service: {
      dispatchPushEvent: (event: UIExtensionPushEvents.PushEvent<any>) => void;
    },
  ];
}>();

const activeShadowApp = ref<{ teardown: () => void } | null>(null);
const container = ref<HTMLElement | null>(null);
let knimeService: null | UIExtensionService = null;

const initKnimeService = () => {
  if (knimeService !== null) {
    return;
  }
  const embedderService = setUpEmbedderService(props.apiLayer);
  knimeService = markRaw(embedderService.service);
  emit("serviceCreated", embedderService);
};

const loadView = async () => {
  initKnimeService();

  // load the shadow root app (es module) if its not already loaded
  const shadowApp = await dynamicImport(props.resourceLocation);

  // create dynamic view in shadow root
  // teardown active view if we have one
  if (activeShadowApp.value) {
    activeShadowApp.value?.teardown();
  }

  // create or reuse shadow root
  const shadowRoot = container.value!.shadowRoot
    ? container.value!.shadowRoot
    : container.value!.attachShadow({ mode: "open" });

  // call module default exported function to load the view
  activeShadowApp.value = shadowApp.default(shadowRoot, knimeService);
};

onMounted(async () => {
  await loadView();
});
</script>

<template>
  <div ref="container" class="ui-ext-shadow-app" :style="style" />
</template>

<style scoped>
.ui-ext-shadow-app {
  overflow: hidden;
}
</style>
