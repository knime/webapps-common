<script setup lang="ts">
import { type Ref, onMounted, ref } from "vue";

import { setUpIframeEmbedderService } from "../logic/iframe/embedder";

import {
  type EventType,
  type PushEvent,
  type UIExtensionServiceAPILayer,
} from "./types";

const props = defineProps<{
  resourceLocation: string;
  apiLayer: UIExtensionServiceAPILayer;
}>();

const emit = defineEmits<{
  serviceCreated: [
    service: {
      dispatchPushEvent: (event: PushEvent<EventType>) => void;
    },
  ];
}>();

const iframe: Ref<null | HTMLIFrameElement> = ref(null);

onMounted(() => {
  const service = setUpIframeEmbedderService(
    props.apiLayer,
    iframe.value!.contentWindow!,
  );
  emit("serviceCreated", service);
});
</script>

<template>
  <iframe
    ref="iframe"
    title="UIExtension Iframe"
    :src="resourceLocation"
    sandbox="allow-downloads allow-scripts allow-same-origin"
  />
</template>

<style lang="postcss" scoped>
iframe {
  width: 100%;
  height: 100%;
  border: none;
  display: block;
}
</style>
