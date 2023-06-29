<script lang="ts">
import { defineComponent } from "vue";
import CodeExample from "./demo/CodeExample.vue";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import RichTextEditor from "webapps-common/ui/components/forms/RichTextEditor";
import code from "webapps-common/ui/components/forms/RichTextEditor/RichTextEditor.vue?raw";

const codeExample = `
<RichTextEditor
  v-model="value"
  :editable="editable"
  :enabled-tools={ all: true }
  :min-height="minHeight"
  :max-height="maxHeight"
/>

<RichTextEditor
  v-model="value"
  :editable="editable"
  :min-height="minHeight"
  :max-height="maxHeight"
  :enabled-tools="{ bold: true, italic: true, underline: true }"
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

<template>
  <div class="manual-output" v-html="value" />
</template>

<!-- since the markup is set via v-html, the styles cannot be scoped -->
<style lang="postcss">
@import url("webapps-common/ui/components/forms/RichTextEditor/styles.css");

.manual-output {
  border: 1px solid var(--knime-masala);
  border-radius: 4px;
  padding: 4px;

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
      value:
        "<p><strong>Hello</strong> World</p> <br /><u>Underlined</u><blockquote><p>Some famous quote here</p></blockquote>",
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
        <div class="grid-item-12">
          <Checkbox v-model="editable"> Editable </Checkbox>
          <div class="editor-wrapper">
            <RichTextEditor
              v-model="value"
              :base-extensions="{ all: true }"
              :editable="editable"
              :min-height="minHeight"
              :max-height="maxHeight"
            />
          </div>
        </div>
        <div class="grid-item-12">
          <div class="output">
            <h4>Output</h4>
            {{ value }}
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 custom-toolbar-wrapper">
          <h3>Custom toolbar and opt-in tools</h3>

          <div class="editor-wrapper custom-toolbar-wrapper">
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
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 custom-toolbar-wrapper">
          <h3>Render HTML using same styles</h3>

          <div>
            If you want to display a simple element that renders the markup
            outputted by the editor, you are able to do so as well. This is
            helpful, for example, on instances where you want to control
            directly the rendering, like SSR, while at the same time retainig
            the same styles that the editor itself uses (for consistency).
            Here's an example:

            <!-- eslint-disable-next-line vue/no-v-html -->
            <div class="manual-output" v-html="value" />

            <div class="notice">
              <strong>IMPORTANT NOTE!</strong>: Keep in mind that when using
              this approach of manual rendering, you would then need to also
              manually sanitize the content. This is because, by default, the
              editor sanitizes any html it receives when initializing its
              internal value, so that's something you don't have to take care of
              (same as it also sanitizes the output upon user input). But when
              using a manual approach you would then need to perform this
              sanitization yourself just in case the html data was tampered
              with.
            </div>
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

<style lang="postcss">
@import url("webapps-common/ui/components/forms/RichTextEditor/styles.css");

.manual-output {
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
</style>

<style lang="postcss" scoped>
.editor-wrapper {
  max-width: 800px;
  border: 1px solid var(--knime-masala);
}

.output {
  padding: 18px;
}

@define-mixin TEST {
  & p {
    color: red;
  }

  @mixin-content;
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
