<script setup lang="ts">
import { uniqueId } from "lodash";
import {
  computed,
  ref,
  watch,
  onMounted,
  type Ref,
  onUnmounted,
  watchEffect,
  nextTick,
  inject,
} from "vue";
import {
  fetchImage,
  getImageUrl as getImageUrlFromStore,
} from "@/utils/images";

// @ts-ignore
import { useStore } from "vuex";

const props = defineProps<{
  path: string;
  baseUrl: string;
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
const inlinedSrc: Ref<undefined | string> = ref();

const store = useStore();
const fallbackGetImageUrl = (resourceInfo: {
  baseUrl: string;
  path: string;
}): string => getImageUrlFromStore(store, resourceInfo);
const getImageUrl = inject("getImageUrl", fallbackGetImageUrl);

const imageUrl = computed(() =>
  getImageUrl({
    baseUrl: props.baseUrl,
    path: props.path,
  }),
);

const urlWithDimensions = computed(() => {
  /**
   * Use Number.Max_VALUE to automatically get the correct height for the given
   * width Handled in the backend
   */
  return props.width
    ? `${imageUrl.value}?w=${Math.floor(props.width)}&h=${Math.floor(
        typeof props.height === "number" ? props.height : Number.MAX_VALUE,
      )}`
    : imageUrl.value;
});

let uuid: string | null = null;
onMounted(async () => {
  if (props.includeDataInHtml) {
    uuid = uniqueId("Image");
    emit("pending", uuid);
    await waitForTableToBeReady();
    inlinedSrc.value = await fetchImage(urlWithDimensions.value);
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
    fixedSrc = update ? null : urlWithDimensions.value;
  },
  { immediate: true },
);
</script>

<template>
  <img
    v-if="!includeDataInHtml || inlinedSrc"
    :style="{
      ...(typeof width === 'number' && { maxWidth: width + 'px' }),
      ...(typeof height === 'number' && { maxHeight: height + 'px' }),
    }"
    loading="lazy"
    :src="includeDataInHtml ? inlinedSrc : fixedSrc || urlWithDimensions"
    alt=""
  />
</template>
