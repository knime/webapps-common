<script setup lang="ts">
import {
  computed,
  inject,
  nextTick,
  onMounted,
  onUnmounted,
  ref,
  watch,
  watchEffect,
} from "vue";
import { uniqueId } from "lodash-es";

import {
  ResourceService,
  type UIExtensionService,
} from "@knime/ui-extension-service";

import { fetchImage } from "@/utils/images";

const props = defineProps<{
  path: string;
  height?: number;
  width?: number;
  update?: boolean;
  includeDataInHtml: boolean;
  tableIsReady: boolean;
}>();

const waitForTableToBeReady = () =>
  new Promise<void>((resolve) => {
    watchEffect(() => {
      if (props.tableIsReady) {
        resolve();
      }
    });
  });

const emit = defineEmits(["pending", "rendered"]);
const inlinedSrc = ref<string | undefined>();

const knimeService = inject<() => UIExtensionService>("getKnimeService")!();
const resourceService = new ResourceService(knimeService);

const addDimensions = computed(() => (imageUrl: string) => {
  /**
   * Use Number.Max_VALUE to automatically get the correct height for the given
   * width Handled in the backend
   */
  return props.width
    ? `${imageUrl}?w=${Math.floor(props.width)}&h=${Math.floor(
        typeof props.height === "number" ? props.height : Number.MAX_VALUE,
      )}`
    : imageUrl;
});

const imageUrl = ref<string | null>(null);

const imageUrlWithDimensions = computed(() => {
  return imageUrl.value === null ? null : addDimensions.value(imageUrl.value);
});

watchEffect(() => {
  resourceService.getResourceUrl(props.path).then((newImageUrl) => {
    imageUrl.value = newImageUrl;
  });
});

let uuid: string | null = null;
onMounted(async () => {
  imageUrl.value = await resourceService.getResourceUrl(props.path);
  if (props.includeDataInHtml) {
    uuid = uniqueId("Image");
    emit("pending", uuid);
    await waitForTableToBeReady();
    inlinedSrc.value = await fetchImage(imageUrlWithDimensions.value!);
    // wait until image was rendered in the DOM
    await nextTick();
    emit("rendered", uuid);
  }
});

onUnmounted(() => {
  if (props.includeDataInHtml) {
    emit("rendered", uuid);
  }
});

let fixedSrc: null | string = null;
watch(
  () => props.update,
  (update) => {
    fixedSrc = update ? null : imageUrlWithDimensions.value;
  },
  { immediate: true },
);

watch(
  () => imageUrlWithDimensions.value,
  (newValue, oldValue) => {
    if (oldValue === null && !props.update) {
      fixedSrc = newValue;
    }
  },
  { immediate: true },
);
</script>

<template>
  <img
    v-if="(!includeDataInHtml || inlinedSrc) && imageUrlWithDimensions"
    :style="{
      ...(typeof width === 'number' && { maxWidth: width + 'px' }),
      ...(typeof height === 'number' && { maxHeight: height + 'px' }),
    }"
    loading="lazy"
    :src="includeDataInHtml ? inlinedSrc : fixedSrc || imageUrlWithDimensions"
    alt=""
  />
</template>
