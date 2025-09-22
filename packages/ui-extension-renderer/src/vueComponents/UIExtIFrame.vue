<script setup lang="ts">
import { type Ref, onBeforeUnmount, onMounted, ref } from "vue";

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
  escapePressed: [];
}>();

const handleEscapeMessage = (event: MessageEvent) => {
  if (event.data.type === "UIExtensionEscapePressed") {
    emit("escapePressed");
  }
};

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

  window.addEventListener("message", handleEscapeMessage);
});

onBeforeUnmount(() => {
  window.removeEventListener("message", handleEscapeMessage);
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
  display: block;
  width: 100%;
  height: 100%;
  border: none;
}
</style>
