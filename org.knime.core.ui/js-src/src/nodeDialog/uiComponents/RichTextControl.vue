<script setup lang="ts">
import {
  RichTextEditor,
  createOnEscapeExtension,
} from "@knime/rich-text-editor";
import useDialogControl from "../composables/components/useDialogControl";
import { rendererProps } from "@jsonforms/vue";
import LabeledControl from "./label/LabeledControl.vue";
import { ref } from "vue";
const props = defineProps(rendererProps());
const { control, onChange, disabled } = useDialogControl<string>({ props });

const richTextEditorElement = ref<{ $el: HTMLElement } | null>(null);
/**
 * TODO: Remove and resolve properly with https://knime-com.atlassian.net/browse/UIEXT-1461-
 */
const CloseDialogOnEscape = createOnEscapeExtension(() => {
  richTextEditorElement.value!.$el.focus();
  return true;
});
</script>

<template>
  <LabeledControl
    #default="{ labelForId }"
    fill
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
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
      }"
      :custom-extensions="[CloseDialogOnEscape]"
      @update:model-value="onChange"
    />
  </LabeledControl>
</template>

<style lang="postcss" scoped>
.editor {
  height: calc(100% - 20px);

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
