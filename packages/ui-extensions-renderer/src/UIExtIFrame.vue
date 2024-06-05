<script setup lang="ts">
import {
  setUpIframeEmbedderService,
  UIExtensionPushEvents,
  type UIExtensionServiceAPILayer,
} from "@knime/ui-extension-service";
import { onMounted, ref, type Ref } from "vue";

const props = defineProps<{
  resourceLocation: string;
  apiLayer: UIExtensionServiceAPILayer;
}>();

const emit = defineEmits<{
  serviceCreated: [
    service: {
      dispatchPushEvent: (event: UIExtensionPushEvents.PushEvent<any>) => void;
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
