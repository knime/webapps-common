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

const getImageUrl = (path: string, baseUrl: string) => {
  return getImageUrlFromStore(store, {
    baseUrl,
    path,
  });
};

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
  const imageUrl = getImageUrl(initialData.imagePath, baseUrl);
  if (reportingService.isReportingActive()) {
    imgSrc.value = await fetchImage(imageUrl);
    // wait for the render to be updated accordingly
    await nextTick();
    reportingService.setRenderCompleted();
  } else {
    imgSrc.value = imageUrl;
  }
  nextTick(() => {
    image.value.onload = () => {
      naturalHeight.value = image.value.naturalHeight;
      loaded.value = true;
    };
  });
});

const scale = toRef(viewSettings, "shrinkToFit");
</script>

<template>
  <div v-show="loaded" class="scroll-container">
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
/* div is required here to make the selector more specific than a pagebuilder selector that sets overflow to hidden */
div.scroll-container {
  overflow: auto;
  height: 100%;
  display: flex;
  flex-direction: column;
}

/** 
 * There is a gap of 4px to the figcaption because img is an inline element. 
 * But since we also want this gap when using the image inside a flexbox, we style this gap ourselves.
 */
img {
  display: block;
  margin-bottom: 4px;

  &.scale {
    flex: 1;
    min-height: 0;
    object-fit: scale-down;
    object-position: top left;
  }
}
</style>
