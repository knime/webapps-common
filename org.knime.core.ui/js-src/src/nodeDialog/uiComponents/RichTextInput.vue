<script>
import { defineComponent } from 'vue';
import { rendererProps } from '@jsonforms/vue';
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from '../utils';
import RichTextEditor from 'webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue';
import LabeledInput from './LabeledInput.vue';
import { useJsonFormsControlWithUpdate } from './composables/jsonFormsControlWithUpdate';

const RichTextInput = defineComponent({
    name: 'RichTextInput',
    components: {
        RichTextEditor,
        LabeledInput
    },
    props: {
        ...rendererProps()
    },
    emits: ['update'],
    setup(props) {
        return useJsonFormsControlWithUpdate(props);
    },
    computed: {
        isModelSettingAndHasNodeView() {
            return isModelSettingAndHasNodeView(this.control);
        },
        flowSettings() {
            return getFlowVariablesMap(this.control);
        },
        disabled() {
            return !this.control.enabled || this.flowSettings?.controllingFlowVariableAvailable;
        }
    },
    mounted() {
        this.initialValue = this.control.data;
    },
    methods: {
        onChange(event) {
            this.handleChange(this.control.path, event);
            if (this.isModelSettingAndHasNodeView) {
                this.$store.dispatch('pagebuilder/dialog/dirtySettings', true);
            }
        }
    }

});
export default RichTextInput;
</script>

<template>
  <LabeledInput
    :text="control.label"
    :description="control.description"
    :errors="[control.errors]"
    :scope="control.uischema.scope"
    :flow-settings="flowSettings"
    class="input-wrapper"
  >
    <RichTextEditor
      class="editor"
      :class="{'editor-editable': !disabled}"
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
        strike: true
      }"
      @update:model-value="onChange"
    />
  </LabeledInput>
</template>

<style lang="postcss" scoped>

.editor {
    height: calc(100% - 20px);
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
 
