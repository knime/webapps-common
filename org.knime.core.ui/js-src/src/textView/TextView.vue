<script>
import {
  JsonDataService,
  ReportingService,
  SharedDataService,
} from "@knime/ui-extension-service";

export default {
  inject: ["getKnimeService"],
  data() {
    return {
      richTextContent: "",
      flowVariablesMap: null,
      jsonDataService: null,
    };
  },
  computed: {
    knimeService() {
      return this.getKnimeService();
    },
  },
  async mounted() {
    this.jsonDataService = new JsonDataService(this.knimeService);
    const sharedDataService = new SharedDataService(this.knimeService);
    sharedDataService.addSharedDataListener(
      this.onViewSettingsChange.bind(this),
    );
    const { content } = await this.jsonDataService.initialData();
    this.richTextContent = content;
    const reportingService = new ReportingService(this.knimeService);
    const isReport = reportingService.isReportingActive();
    await this.$nextTick();
    if (isReport) {
      await reportingService.setRenderCompleted();
    }
  },
  methods: {
    async onViewSettingsChange(payload) {
      this.richTextContent = await this.jsonDataService.data({
        method: "getContent",
        options: [payload.data.view.richTextContent],
      });
    },
  },
};
</script>

<template>
  <div class="text-view-container" v-html="richTextContent" />
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/rich-text-editor.css");

.text-view-container:deep() {
  @mixin rich-text-editor-styles;

  /* needed to display multiple line breaks https://github.com/ueberdosis/tiptap/issues/412 */
  & p:empty::after {
    content: "\00A0";
  }

  & p.small-text {
    font-size: 7px;
  }
}
</style>
