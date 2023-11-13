<script lang="ts">
import { defineComponent } from "vue";
import CodeExample from "./demo/CodeExample.vue";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import RichTextEditor from "webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue";
import code from "webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue?raw";

const codeExample = `
<RichTextEditor
  v-model="value"
  :base-extensions="{ all: true }"
  :editable="editable"
  :min-height="minHeight"
  :max-height="maxHeight"
/>

<div class="custom-toolbar-wrapper">
  <RichTextEditor
    v-model="value"
    :editable="editable"
    :min-height="minHeight"
    :max-height="maxHeight"
    :base-extensions="{ bold: true, italic: true }"
  >
    <template #customToolbar="{ tools }">
      <div class="custom-toolbar">
        <FunctionButton
          v-for="tool of tools"
          :key="tool.id"
          class="tool"
          :active="tool.active?.()"
          @click="tool.onClick()"
        >
          <Component :is="tool.icon" />
        </FunctionButton>
      </div>
    </template>
  </RichTextEditor>
</div>

<template>
  <div class="static-output" v-html="value" />
</template>

<style lang="postcss" scoped>
@import url("webapps-common/ui/components/forms/RichTextEditor/styles.css");

.static-output:deep() {
  @mixin rich-text-editor-styles;
}
</style>
`;

export default defineComponent({
  components: {
    Checkbox,
    CodeExample,
    RichTextEditor,
    FunctionButton,
  },
  data() {
    return {
      editable: true,
      disabled: false,
      value:
        '<h5>A Heading</h5><p><strong>Hello</strong> World</p><p class="small-text">Some <u>small</u> text.</p> <br /><u>Underlined</u><blockquote><p>Some famous quote here</p></blockquote>',
      minHeight: 150,
      maxHeight: 300,
      code,
      codeExample,
    };
  },
});
</script>

<template>
  <div>
    <section>
      <div class="grid-container">
        <div class="grid-item-6">
          <Checkbox v-model="editable"> Editable </Checkbox><br />
          <Checkbox v-model="disabled"> Disabled </Checkbox>
          <RichTextEditor
            v-model="value"
            :base-extensions="{ all: true }"
            :editable="editable"
            :disabled="disabled"
            :min-height="minHeight"
            :max-height="maxHeight"
          />
        </div>
        <div class="grid-item-6">
          <strong>Output:</strong><br />
          {{ value }}
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 custom-toolbar-wrapper">
          <h5>Custom toolbar and opt-in tools</h5>

          <div class="custom-toolbar-wrapper">
            <RichTextEditor
              v-model="value"
              :editable="editable"
              :disabled="disabled"
              :min-height="minHeight"
              :max-height="maxHeight"
              :base-extensions="{ bold: true, italic: true }"
            >
              <template #customToolbar="{ tools }">
                <div class="custom-toolbar">
                  <FunctionButton
                    v-for="tool of tools"
                    :key="tool.id"
                    class="tool"
                    :active="tool.active?.()"
                    @click="tool.onClick?.()"
                  >
                    <Component :is="tool.icon" />
                  </FunctionButton>
                </div>
              </template>
            </RichTextEditor>
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <h5>Render output HTML using same styles</h5>

          If you want to statically render the markup outputted by the editor,
          you can do it like in this example:

          <!-- eslint-disable-next-line vue/no-v-html -->
          <div class="static-output" v-html="value" />

          <div class="notice">
            <strong>IMPORTANT!</strong>: When using the editor, it sanitizes any
            HTML it receives. But when rendering the content without the editor,
            you need to take care of sanitization.
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show RichTextEditor.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
@import url("webapps-common/ui/components/forms/RichTextEditor/styles.css");

.static-output:deep() {
  border: 1px solid var(--knime-masala);
  border-radius: 4px;
  padding: 4px;

  /*
  You can apply the styles individually

  @mixin rich-text-editor-base;
  @mixin rich-text-editor-headings;
  @mixin rich-text-editor-hr;
  @mixin rich-text-editor-p;
  @mixin rich-text-editor-blockquote;
  @mixin rich-text-editor-code;
  @mixin rich-text-editor-lists;
  @mixin rich-text-editor-links;
  */

  /* Or use this mixins that includes everything */
  @mixin rich-text-editor-styles;
}

.notice {
  background-color: var(--knime-yellow);
  color: var(--knime-masala);
  font-size: 14px;
  padding: 4px;
  border: 1px solid var(--knime-masala);
}

.custom-toolbar-wrapper {
  position: relative;

  & .custom-toolbar {
    position: absolute;
    background: var(--knime-cornflower);
    height: 40px;
    top: -40px;
    left: -1px;
    display: flex;
    align-items: center;
    border-radius: 6px 6px 0 0;
    padding: 0 12px;

    & .tool {
      & svg {
        stroke: var(--knime-white);
      }
    }
  }
}
</style>
