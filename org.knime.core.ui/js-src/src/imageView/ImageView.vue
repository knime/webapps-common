<script>
// TODO <script lang="ts">
import { JsonDataService, ReportingService } from "@knime/ui-extension-service";
import { fetchImage } from "../tableView/utils/images";
import Label from "webapps-common/ui/components/forms/Label.vue";

export default {
  components: {
    Label,
  },
  inject: ["getKnimeService"],
  data() {
    return {
      title: null,
      altText: null,
      caption: null,
      imagePath: null,
      imgSrc: null,
    };
  },
  computed: {
    knimeService() {
      return this.getKnimeService();
    },
  },
  async mounted() {
    const jsonDataService = new JsonDataService(this.knimeService);
    jsonDataService.addOnDataChangeCallback(
      this.onViewSettingsChange.bind(this),
    );
    const initialData = await jsonDataService.initialData();
    this.setData(initialData.settings);
    this.imagePath = initialData.imagePath;
    const reportingService = new ReportingService(this.knimeService);
    const isReport = reportingService.isReportingActive();
    this.imgSrc = isReport
      ? await fetchImage(this.getImageUrl())
      : this.getImageUrl();
    await this.$nextTick();
    if (isReport) {
      reportingService.setRenderCompleted();
    }
  },
  methods: {
    onViewSettingsChange(event) {
      this.setData(event.data.data.view);
    },
    setData(settings) {
      this.title = settings.title;
      this.altText = settings.altText;
      this.caption = settings.caption;
    },
    getImageUrl() {
      const baseUrl = this.knimeService?.extensionConfig?.resourceInfo?.baseUrl;
      // TODO unfortunate coupling with pagebuilder internals - see NXT-1295
      // TODO: UIEXT-887 We don't want to have to access the store here.
      // TODO refactor / merge with ImageRenderer code
      return this.$store.getters["api/uiExtResourceLocation"]({
        resourceInfo: {
          baseUrl,
          path: this.imagePath,
        },
      });
    },
  },
};
</script>

<template>
  <div class="scroll-container">
    <Label v-if="title" #default="{ labelForId }" :text="title" large>
      <figure v-if="caption" :id="labelForId" class="image-view-figure">
        <img class="image-view-image" :src="imgSrc" :alt="altText" />
        <figcaption>{{ caption }}</figcaption>
      </figure>
      <img
        v-else
        :id="labelForId"
        class="image-view-image"
        :src="imgSrc"
        :alt="altText"
      />
    </Label>
    <figure v-else-if="caption" class="image-view-figure">
      <img class="image-view-image" :src="imgSrc" :alt="altText" />
      <figcaption>{{ caption }}</figcaption>
    </figure>
    <img v-else class="image-view-image" :src="imgSrc" :alt="altText" />
  </div>
</template>

<style scoped>
.scroll-container {
  overflow: auto;
}

.image-view-figure {
  margin: 0;
}

.image-view-image {
  max-width: 100%;
  max-height: 100%;
}
</style>
