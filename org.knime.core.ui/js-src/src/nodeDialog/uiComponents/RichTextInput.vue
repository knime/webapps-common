<script lang="ts">
import { defineComponent } from "vue";
import { rendererProps } from "@jsonforms/vue";
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from "../utils";
import RichTextEditor from "webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue";
import createOnEscapeExtension from "webapps-common/ui/components/forms/RichTextEditor/createOnEscapeExtension";

import LabeledInput from "./LabeledInput.vue";
import { useJsonFormsControlWithUpdate } from "../composables/useJsonFormsControlWithUpdate";
import inject from "../utils/inject";
const RichTextInput = defineComponent({
  name: "RichTextInput",
  components: {
    RichTextEditor,
    LabeledInput,
  },
  props: {
    ...rendererProps(),
  },
  emits: ["update"],
  setup(props) {
    const closeDialog = inject("closeDialog");
    /**
     * TODO: Remove and resolve properly with https://knime-com.atlassian.net/browse/UIEXT-1461-
     */
    const CloseDialogOnEscape = createOnEscapeExtension(() => {
      closeDialog();
      return true;
    });
    return { ...useJsonFormsControlWithUpdate(props), CloseDialogOnEscape };
  },
  computed: {
    isModelSettingAndHasNodeView() {
      return isModelSettingAndHasNodeView(this.control);
    },
    flowSettings() {
      return getFlowVariablesMap(this.control);
    },
    disabled() {
      return (
        !this.control.enabled ||
        Boolean(this.flowSettings?.controllingFlowVariableName)
      );
    },
  },
  methods: {
    onChange(value: string) {
      this.handleChange(this.control.path, value);
      if (this.isModelSettingAndHasNodeView) {
        // @ts-expect-error
        this.$store.dispatch("pagebuilder/dialog/dirtySettings", true);
      }
    },
  },
});
export default RichTextInput;
</script>

<template>
  <LabeledInput
    #default="{ labelForId }"
    :config-keys="control?.schema?.configKeys"
    :flow-variables-map="control.rootSchema.flowVariablesMap"
    :path="control.path"
    :text="control.label"
    :description="control.description"
    :errors="[control.errors]"
    :flow-settings="flowSettings"
    class="input-wrapper"
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
        blockQuote: true,
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

.input-wrapper {
  height: 100%;

  &:deep(.label-wrapper) {
    height: 100%;
  }
}
</style>
