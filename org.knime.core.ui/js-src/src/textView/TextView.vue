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
    };
  },
  computed: {
    knimeService() {
      return this.getKnimeService();
    },
  },
  async mounted() {
    const jsonDataService = new JsonDataService(this.knimeService);
    const sharedDataService = new SharedDataService(this.knimeService);
    sharedDataService.addSharedDataListener(
      this.onViewSettingsChange.bind(this),
    );
    const { content, flowVariablesMap } = await jsonDataService.initialData();
    this.flowVariablesMap = flowVariablesMap;
    this.richTextContent = this.replaceFlowVariablesInContent(content);
    const reportingService = new ReportingService(this.knimeService);
    const isReport = reportingService.isReportingActive();
    await this.$nextTick();
    if (isReport) {
      await reportingService.setRenderCompleted();
    }
  },
  methods: {
    onViewSettingsChange(payload) {
      // TODO: Can be removed once we have frontend sanitization
      if (
        payload.flowVariableSettings["view.richTextContent"]
          ?.controllingFlowVariableAvailable
      ) {
        return;
      }
      this.richTextContent = this.replaceFlowVariablesInContent(
        payload.data.view.richTextContent,
      );
    },
    replaceFlowVariablesInContent(newRichTextContent) {
      if (this.flowVariablesMap === null) {
        return newRichTextContent;
      }
      Object.entries(this.flowVariablesMap).forEach(([key, value]) => {
        newRichTextContent = newRichTextContent.replaceAll(
          `$$["${key}"]`,
          value,
        );
        newRichTextContent = newRichTextContent.replaceAll(
          `$$[&#34;${key}&#34;]`,
          value,
        );
      });
      return newRichTextContent;
    },
  },
};
</script>

<template>
  <div class="text-view-container" v-html="richTextContent" />
</template>

<style lang="postcss" scoped>
@import url("webapps-common/ui/components/forms/RichTextEditor/styles.css");

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
