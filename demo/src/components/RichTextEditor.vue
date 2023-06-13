<script lang="ts">
import { defineComponent } from "vue";
import CodeExample from "./demo/CodeExample.vue";
import Checkbox from "webapps-common/ui/components/forms/Checkbox.vue";
import FunctionButton from "webapps-common/ui/components/FunctionButton.vue";
import RichTextEditor from "webapps-common/ui/components/RichTextEditor/RichTextEditor.vue";
import code from "webapps-common/ui/components/RichTextEditor/RichTextEditor.vue?raw";

const codeExample = `
<RichTextEditor
  compact
  :editable="editable"
  :initial-value="initialValue"
  :min-height="minHeight"
  :max-height="maxHeight"
  @change="updatedValue = $event"
/>

<RichTextEditor
  compact
  :editable="editable"
  :initial-value="initialValue"
  :min-height="minHeight"
  :max-height="maxHeight"
  :disabled-tools="{ textAlign: true }"
  @change="updatedValue = $event"
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
      compact: true,
      editable: true,
      initialValue: "<p><strong>Hello</strong> World</p>",
      minHeight: 150,
      maxHeight: 300,
      disabledTools: {},
      updatedValue: "<p><strong>Hello</strong> World</p>",
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
          <Checkbox v-model="editable"> Toggle editable </Checkbox>
          &nbsp;
          <Checkbox v-model="compact"> Toggle compact </Checkbox>
          <div class="editor-wrapper">
            <RichTextEditor
              :compact="compact"
              :editable="editable"
              :initial-value="initialValue"
              :min-height="minHeight"
              :max-height="maxHeight"
              @change="updatedValue = $event"
            />
          </div>
        </div>
        <div class="grid-item-12">
          <div class="output">
            <h4>Output</h4>
            {{ updatedValue }}
          </div>
        </div>
      </div>
    </section>
    <section>
      <div class="grid-container">
        <div class="grid-item-12 custom-toolbar-wrapper">
          <h3>Custom toolbar</h3>

          <div class="editor-wrapper custom-toolbar-wrapper">
            <RichTextEditor
              compact
              :editable="editable"
              :initial-value="initialValue"
              :min-height="minHeight"
              :max-height="maxHeight"
              :disabled-tools="{ textAlign: true }"
              @change="updatedValue = $event"
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
        <div class="grid-item-12">
          <CodeExample summary="Show usage example">{{
            codeExample
          }}</CodeExample>
          <CodeExample summary="Show SearchInput.vue source code">{{
            code
          }}</CodeExample>
        </div>
      </div>
    </section>
  </div>
</template>

<style lang="postcss" scoped>
.editor-wrapper {
  width: 800px;
  border: 1px solid var(--knime-masala);
}

.output {
  padding: 18px;
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
