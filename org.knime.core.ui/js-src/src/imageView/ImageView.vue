<script setup lang="ts">
import {
  type Ref,
  inject,
  nextTick,
  onMounted,
  reactive,
  ref,
  toRef,
} from "vue";

import {
  JsonDataService,
  ReportingService,
  ResourceService,
  SharedDataService,
  type UIExtensionService,
} from "@knime/ui-extension-service";

import { fetchImage } from "@/utils/images";

import NoPageBreak from "./NoPageBreak.vue";
import OptionalFigure from "./OptionalFigure.vue";
import OptionalLabel from "./OptionalLabel.vue";
import type { ImageViewSettings } from "./types/ImageViewSettings";
import "../common/main.css";

const viewSettings: ImageViewSettings = reactive({
  title: "",
  altText: "",
  caption: "",
  shrinkToFit: true,
});

const setData = (settings: ImageViewSettings) => {
  Object.assign(viewSettings, settings);
};

const onViewSettingsChange = ({
  data: { view: viewSettings },
}: {
  data: { view: ImageViewSettings };
}) => {
  setData(viewSettings);
};

const imgSrc = ref("");
const image: Ref<HTMLImageElement> = ref(null as any);
const naturalHeight = ref(0);
const loaded = ref(false);

onMounted(async () => {
  const knimeService = inject<() => UIExtensionService>("getKnimeService")!();
  const jsonDataService = new JsonDataService(knimeService);
  const sharedDataService = new SharedDataService(knimeService);
  sharedDataService.addSharedDataListener(onViewSettingsChange);
  const initialData = await jsonDataService.initialData();
  setData(initialData.settings);
  const imageUrl = await new ResourceService(knimeService).getResourceUrl(
    initialData.imagePath,
  );
  const reportingService = new ReportingService(knimeService);
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
        <NoPageBreak :scale="scale">
          <img
            :id="id"
            ref="image"
            :class="[{ scale }]"
            :style="
              naturalHeight
                ? { '--natural-image-height': `${naturalHeight}px` }
                : {}
            "
            :src="imgSrc"
            :alt="viewSettings.altText"
          />
        </NoPageBreak>
      </OptionalFigure>
    </OptionalLabel>
  </div>
</template>

<style scoped>
/**
 * div is required here to make the selector more specific than a ui-ext-shadow-app class selector in
 * knime-js-pagebuilder that sets overflow to hidden
 */
div.scroll-container {
  @media screen {
    overflow: auto;
  }

  @media print {
    overflow: hidden;
  }

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

  @media screen {
    max-height: var(--natural-image-height, unset);
  }

  @media print {
    /** 
    * We limit the height of any image in a report to 100vh to avoid page breaks within an image
    * Page breaks within images within a flex box container lead to 
    * erroneous print behavior in chrome (https://issues.chromium.org/issues/365957545)
    */
    max-height: min(100vh, var(--natural-image-height, 100vh));

    &:not(.scale) {
      object-fit: cover;
      object-position: top;
    }
  }
}
</style>
