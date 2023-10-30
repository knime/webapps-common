<script setup lang="ts">
import { JsonDataService, ReportingService } from "@knime/ui-extension-service";
import {
  fetchImage,
  getImageUrl as getImageUrlFromStore,
} from "@/utils/images";
import OptionalLabel from "./OptionalLabel.vue";
import OptionalFigure from "./OptionalFigure.vue";
import { inject, nextTick, onMounted, reactive, ref } from "vue";
import type { Event, KnimeService } from "@knime/ui-extension-service";
import { useStore } from "vuex";

type Settings = {
  title: string;
  altText: string;
  caption: string;
  shrinkToFit: boolean;
};

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
});
</script>

<template>
  <div class="scroll-container">
    <OptionalLabel #default="{ labelForId }" :title="viewSettings.title">
      <OptionalFigure
        :id="labelForId"
        #default="{ id }"
        :caption="viewSettings.caption"
      >
        <img
          :id="id"
          :class="[{ scale: viewSettings.shrinkToFit }]"
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
}

/* 
 * height -4px due to collapsing margins,
 * see https://stackoverflow.com/questions/12989931/body-height-100-displaying-vertical-scrollbar
 */
.scale {
  width: 100%;
  height: calc(100% - 4px);
  object-fit: scale-down;
  object-position: top left;
}
</style>
