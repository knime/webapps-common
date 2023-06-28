<script>
import { defineComponent } from 'vue';
import { rendererProps, useJsonFormsControl } from '@jsonforms/vue';
import { isModelSettingAndHasNodeView, getFlowVariablesMap } from '../utils';
import RichTextEditor from 'webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue';

const RichTextInput = defineComponent({
    name: 'RichTextInput',
    components: {
        RichTextEditor
    },
    props: {
        ...rendererProps()
    },
    emits: ['update'],
    setup(props) {
        return useJsonFormsControl(props);
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
  <RichTextEditor
    class="editor"
    :min-height="400"
    :model-value="control.data"
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
</template>

<style lang="postcss" scoped>

.editor {
    flex: 1;
    display: flex;
    flex-direction: column;
    margin-bottom: 20px;

    &:deep(.rich-text-editor) {
        height: auto;
        flex: 1;
    }
}

</style>
 
