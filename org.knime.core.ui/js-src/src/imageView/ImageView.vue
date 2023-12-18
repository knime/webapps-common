<script setup lang="ts">
import { JsonDataService, ReportingService } from "@knime/ui-extension-service";
import {
  fetchImage,
  getImageUrl as getImageUrlFromStore,
} from "@/utils/images";
import OptionalLabel from "./OptionalLabel.vue";
import OptionalFigure from "./OptionalFigure.vue";
import type Settings from "./types/ImageViewSettings";
import {
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRef,
  type Ref,
} from "vue";
import type { Event, KnimeService } from "@knime/ui-extension-service";
// @ts-ignore
import { useStore } from "vuex";

const viewSettings: Settings = reactive({
  title: "",
  altText: "",
  caption: "",
  shrinkToFit: true,
});

const setData = (settings: Settings) => {
  Object.assign(viewSettings, settings);
};

const onViewSettingsChange = (event: Event) => {
  setData(event.data.data.view);
};

const store = useStore();
const fallbackGetImageUrl = (resourceInfo: {
  baseUrl: string;
  path: string;
}): string => getImageUrlFromStore(store, resourceInfo);
const getImageUrl = inject("getImageUrl", fallbackGetImageUrl);

const imgSrc = ref("");
const image: Ref<HTMLImageElement> = ref(null as any);
const naturalHeight = ref(0);
const loaded = ref(false);

onMounted(async () => {
  const knimeService = inject<() => KnimeService>("getKnimeService")!();
  const jsonDataService = new JsonDataService(knimeService);
  jsonDataService.addOnDataChangeCallback(onViewSettingsChange);
  const initialData = await jsonDataService.initialData();
  setData(initialData.settings);
  const reportingService = new ReportingService(knimeService);

  // @ts-ignore
  const baseUrl = knimeService.extensionConfig?.resourceInfo?.baseUrl;
  const imageUrl = getImageUrl({ path: initialData.imagePath, baseUrl });
  imgSrc.value = reportingService.isReportingActive()
    ? await fetchImage(imageUrl)
    : imageUrl;
  nextTick(() => {
    image.value.onload = () => {
      naturalHeight.value = image.value.naturalHeight;
      loaded.value = true;
      if (reportingService.isReportingActive()) {
        // wait for the render to be updated accordingly
        nextTick(() => {
          reportingService.setRenderCompleted();
        });
      }
    };
  });
});

const scale = toRef(viewSettings, "shrinkToFit");
</script>

<template>
  <div v-show="loaded" :class="['scroll-container', { scale }]">
    <OptionalLabel
      #default="{ labelForId }"
      :scale="scale"
      :title="viewSettings.title"
    >
      <OptionalFigure
        :id="labelForId"
        #default="{ id }"
        :scale="scale"
        :caption="viewSettings.caption"
      >
        <img
          :id="id"
          ref="image"
          :class="[{ scale }]"
          :style="naturalHeight ? { maxHeight: `${naturalHeight}px` } : {}"
          :src="imgSrc"
          :alt="viewSettings.altText"
        />
      </OptionalFigure>
    </OptionalLabel>
  </div>
</template>

<style scoped>
/**
 * div is required here to make the selector more specific than a ui-ext-component class selector in
 * knime-js-pagebuilder that sets overflow to hidden
 */
div.scroll-container {
  overflow: auto;
  height: 100%;

  &.scale {
    display: flex;
    flex-direction: column;
  }
}

/**
 * There is a gap of 4px to the figcaption because img is an inline element.
 * But since we also want this gap when using the image inside a flexbox, we style this gap ourselves.
 */
img {
  display: block;
  margin-bottom: 4px;
  object-fit: none;
  object-position: top left;

  &.scale {
    min-height: 0;
    object-fit: scale-down;
  }
}
</style>
