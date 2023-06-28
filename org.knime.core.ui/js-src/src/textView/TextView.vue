<script>
import { JsonDataService } from '@knime/ui-extension-service';

export default {
    inject: ['getKnimeService'],
    data() {
        return {
            richTextContent: '',
            flowVariablesMap: null
        };
    },
    computed: {
        knimeService() {
            return this.getKnimeService();
        }
    },
    async mounted() {
        this.jsonDataService = new JsonDataService(this.knimeService);
        this.jsonDataService.addOnDataChangeCallback(this.onViewSettingsChange.bind(this));
        const initialData = await this.jsonDataService.initialData();
        this.richTextContent = initialData.content;
        this.flowVariablesMap = initialData.flowVariablesMap;
        // TODO needs to be removed as soon as we have a reporting service
        const isReporting = this.knimeService.extensionConfig?.generatedImageActionId === 'generatingReportContent';
        if (isReporting) {
            await this.$store.dispatch('pagebuilder/setReportingContent', {
                nodeId: this.knimeService.extensionConfig.nodeId,
                reportContent: false
            });
        }
    },
    methods: {
        onViewSettingsChange(event) {
            if (this.flowVariablesMap === null) {
                return;
            }
            let newText = event.data.data.view.richTextContent;
            Object.entries(this.flowVariablesMap).forEach(([key, value]) => {
                newText = newText.replaceAll(`$$[${key}]`, value);
            });
            this.richTextContent = newText;
        }
    }
};
</script>

<template>
  <div
    class="text-view-container"
    v-html="richTextContent"
  />
</template>

<style lang="postcss" scoped>
@import url("webapps-common/ui/components/forms/RichTextEditor/styles.css");

.text-view-container {
    padding: 12px;
}

.text-view-container:deep() {
    @mixin rich-text-editor-styles;

    /* needed to display multiple line breaks https://github.com/ueberdosis/tiptap/issues/412 */
    & p:empty::after {
    content: "\00A0";
}
}
</style>
