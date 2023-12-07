<script setup lang="ts">
import RichTextEditor from "webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue";
import createOnEscapeExtension from "webapps-common/ui/components/forms/RichTextEditor/createOnEscapeExtension";
import inject from "../utils/inject";
import useDialogControl from "../composables/useDialogControl";
import { rendererProps } from "@jsonforms/vue";
import LabeledInput from "./label/LabeledInput.vue";
const props = defineProps(rendererProps());
const {
  control,
  handleDirtyChange: onChange,
  disabled,
} = useDialogControl<string>({ props });

const closeDialog = inject("closeDialog");
/**
 * TODO: Remove and resolve properly with https://knime-com.atlassian.net/browse/UIEXT-1461-
 */
const CloseDialogOnEscape = createOnEscapeExtension(() => {
  closeDialog();
  return true;
});
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    fill
    :control="control"
    @controlling-flow-variable-set="onChange"
  >
    <RichTextEditor
      :id="labelForId"
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
  </LabeledInput>
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
