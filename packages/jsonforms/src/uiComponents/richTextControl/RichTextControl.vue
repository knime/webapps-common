<script setup lang="ts">
import { computed, ref } from "vue";

import {
  RichTextEditor,
  createOnEscapeExtension,
  defaultLinkToolOptions,
} from "@knime/rich-text-editor";

import type { VueControlPropsForLabelContent } from "../../higherOrderComponents/control/withLabel";

import DialogLinkModal from "./DialogLinkModal.vue";

const props = defineProps<VueControlPropsForLabelContent<string>>();

const richTextEditorElement = ref<{ $el: HTMLElement } | null>(null);
/**
 * TODO: Remove and resolve properly with https://knime-com.atlassian.net/browse/UIEXT-1461-
 */
const CloseDialogOnEscape = createOnEscapeExtension(() => {
  richTextEditorElement.value!.$el.focus();
  return true;
});

const isFlowVarTemplate = (url: string) =>
  url.startsWith('$$["') && url.endsWith('"]');

const linkToolOptions = computed<typeof defaultLinkToolOptions>(() =>
  props.control.uischema.options?.useFlowVarTemplates
    ? {
        urlValidator: (url: string) => {
          if (isFlowVarTemplate(url)) {
            return true;
          }
          return defaultLinkToolOptions.urlValidator(url);
        },
        sanitizeUrlText: (url: string) => {
          if (isFlowVarTemplate(url)) {
            return url;
          }
          return defaultLinkToolOptions.sanitizeUrlText(url);
        },
      }
    : defaultLinkToolOptions,
);
</script>

<template>
  <RichTextEditor
    :id="labelForId"
    ref="richTextEditorElement"
    :tabindex="-1"
    class="editor"
    :class="{ 'editor-editable': !disabled }"
    :min-height="400"
    :model-value="control.data"
    :editable="!disabled"
    :disabled="disabled"
    :base-extensions="{
      bold: true,
      italic: true,
      underline: true,
      textAlign: true,
      bulletList: true,
      orderedList: true,
      heading: true,
      blockquote: true,
      code: true,
      codeBlock: true,
      horizontalRule: true,
      strike: true,
      paragraphTextStyle: true,
      link: true,
    }"
    :link-tool-options="linkToolOptions"
    :custom-extensions="[CloseDialogOnEscape]"
    @update:model-value="changeValue"
  >
    <template #linkModal="{ linkTool }">
      <DialogLinkModal
        v-if="linkTool"
        :link-tool="linkTool"
        :use-flow-var-templates="control.uischema.options?.useFlowVarTemplates"
      />
    </template>
  </RichTextEditor>
</template>

<style lang="postcss" scoped>
.editor {
  height: 100%;

  &:deep(.tools) {
    --item-size: 30;
  }
}

.editor-editable {
  &:deep(.rich-text-editor) {
    height: calc(100% - var(--toolbar-height));
  }
}
</style>
