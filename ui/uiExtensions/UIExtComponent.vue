<script lang="ts" setup>
import {
  type UIExtensionServiceAPILayer,
  type UIExtensionPushEvents,
  type UIExtensionService,
  setUpEmbedderService,
  JsonDataService,
} from "@knime/ui-extension-service";

import { markRaw, onMounted, ref } from "vue";
import { useDynamicImport } from "./useDynamicImport";
const { dynamicImport } = useDynamicImport();

interface Props {
  resourceLocation: string;
  apiLayer: UIExtensionServiceAPILayer;
}
const props = defineProps<Props>();

const emit = defineEmits<{
  serviceCreated: [
    _service: {
      dispatchPushEvent: (event: UIExtensionPushEvents.PushEvent<any>) => void;
    },
  ];
}>();

const activeDynamicView = ref<{ teardown: () => void } | null>(null);
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

  // TODO: NXT-2291 This is a hack as we only have one type right now
  const shadowRootLibLocation = props.resourceLocation.replace(
    ".umd.js",
    ".js",
  );

  // load the dynamic view (es module) if its not already loaded
  const dynamicView = await dynamicImport(shadowRootLibLocation);

  // create dynamic view in shadow root
  // teardown active view if we have one
  if (activeDynamicView.value) {
    activeDynamicView.value?.teardown();
  }

  // create or reuse shadow root
  const shadowRoot = container.value!.shadowRoot
    ? container.value!.shadowRoot
    : container.value!.attachShadow({ mode: "open" });

  const initialData = props.apiLayer.getConfig().initialData
    ? await new JsonDataService(knimeService!).initialData()
    : null;

  // call module default exported function to load the view
  activeDynamicView.value = dynamicView.default(
    shadowRoot,
    knimeService,
    initialData,
  );
};

onMounted(async () => {
  await loadView();
});
</script>

<template>
  <div ref="container" class="ui-ext-component" />
</template>

<style scoped>
.ui-ext-component {
  /** required for the table view */
  height: 100%;
  overflow: hidden;
}
</style>
