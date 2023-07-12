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
        },
        disabled() {
            return this.flowSettings?.controllingFlowVariableAvailable;
        },
        flowSettings() {
            return getFlowVariablesMap(this.control);
        }
    },
    async mounted() {
        this.jsonDataService = new JsonDataService(this.knimeService);
        this.jsonDataService.addOnDataChangeCallback(this.onViewSettingsChange.bind(this));
        const { content, flowVariablesMap } = await this.jsonDataService.initialData();
        this.flowVariablesMap = flowVariablesMap;
        this.richTextContent = this.replaceFlowVariablesInContent(content);
        // TODO needs to be removed as soon as we have a reporting service
        const isReporting = this.knimeService.extensionConfig?.generatedImageActionId === 'generatingReportContent';
        await this.$nextTick();
        if (isReporting) {
            await this.$store.dispatch('pagebuilder/setReportingContent', {
                nodeId: this.knimeService.extensionConfig.nodeId,
                reportContent: false
            });
        }
    },
    methods: {
        onViewSettingsChange(event) {
            // TODO: Can be removed once we have frontend sanitization
            if (event.data.schema.flowVariablesMap['view.richTextContent']?.controllingFlowVariableAvailable) {
                return;
            }
            this.richTextContent = this.replaceFlowVariablesInContent(event.data.data.view.richTextContent);
        },
        replaceFlowVariablesInContent(newRichTextContent) {
            if (this.flowVariablesMap === null) {
                return newRichTextContent;
            }
            Object.entries(this.flowVariablesMap).forEach(([key, value]) => {
                newRichTextContent = newRichTextContent.replaceAll(`$$["${key}"]`, value);
            });
            return newRichTextContent;
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

.text-view-container:deep() {
    @mixin rich-text-editor-styles;

    /* needed to display multiple line breaks https://github.com/ueberdosis/tiptap/issues/412 */
    & p:empty::after {
    content: "\00A0";
}
}
</style>
