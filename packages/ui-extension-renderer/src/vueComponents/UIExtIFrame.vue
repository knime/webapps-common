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

type EventDispatcherService = Awaited<
  ReturnType<typeof setUpIframeEmbedderService>
>;

const iframe: Ref<null | HTMLIFrameElement> = ref(null);
let eventQueue: Array<PushEvent<EventType>> | null = [];
let resolvedDispatcherService: EventDispatcherService;

const emit = defineEmits<{
  serviceCreated: [
    service: {
      dispatchPushEvent: (event: PushEvent<EventType>) => void;
    },
  ];
}>();

onMounted(() => {
  setUpIframeEmbedderService(props.apiLayer, iframe.value!.contentWindow!)
    .then((service) => {
      resolvedDispatcherService = service;

      if (eventQueue) {
        eventQueue.forEach((event) =>
          resolvedDispatcherService.dispatchPushEvent(event),
        );
        // null for GC
        eventQueue = null;
      }
    })
    .catch(() => {});

  const dispatchPushEvent: EventDispatcherService["dispatchPushEvent"] = (
    event,
  ) => {
    if (resolvedDispatcherService) {
      resolvedDispatcherService.dispatchPushEvent(event);
      return;
    }

    if (eventQueue) {
      eventQueue.push(event as PushEvent<EventType>);
    }
  };

  emit("serviceCreated", { dispatchPushEvent });
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
