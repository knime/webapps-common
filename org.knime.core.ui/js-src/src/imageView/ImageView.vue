<script>
import { JsonDataService } from "@knime/ui-extension-service";

export default {
  inject: ["getKnimeService"],
  data() {
    return {
      initialData: null,
    };
  },
  computed: {
    knimeService() {
      return this.getKnimeService();
    },
    getImageUrl() {
      const baseUrl = this.knimeService?.extensionConfig?.resourceInfo?.baseUrl;
      // TODO unfortunate coupling with pagebuilder internals - see NXT-1295
      return this.$store.getters["api/uiExtResourceLocation"]({
        resourceInfo: {
          baseUrl,
          path: this.initialData,
        },
      });
    },
  },
  async mounted() {
    this.initialData = await new JsonDataService(
      this.knimeService,
    ).initialData();
  },
};
</script>

<template>
  <div class="knime-ui-ImageView">
    <div class="scroll-container">
      <img :src="getImageUrl" alt="" />
    </div>
  </div>
</template>
