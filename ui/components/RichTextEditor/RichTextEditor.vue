<script setup lang="ts">
import { computed, onMounted, toRefs, useSlots, watch } from "vue";
import { EditorContent, useEditor } from "@tiptap/vue-3";
import TextAlign from "@tiptap/extension-text-align";
import UnderLine from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import RichTextEditorBaseToolbar from "./RichTextEditorBaseToolbar.vue";
import RichTextEditorToolbar from "./RichTextEditorToolbar.vue";
import type { DisabledTools } from "./types";

interface Props {
  initialValue: string;
  editable?: boolean;
  compact?: boolean;
  /**
   * Max height the editor can have. The editor container will grow up to this
   * value before it starts to overflow the content. By default this is unset, so
   * the editor will grow with the content
   */
  maxHeight?: number | null;
  /**
   * Tools that should be disabled. By default all tools are enabled
   */
  disabledTools?: DisabledTools;
  /**
   * Function to format the display value of each tool's hotkeys as a title when hovered.
   * Receives as parameter the key combinations of each tool and should return
   * the string to be displayed in the title
   * @param hotkey
   */
  hotkeyFormatter?: (hotkey: Array<string>) => string;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  compact: false,
  maxHeight: null,
  disabledTools: () => ({} as DisabledTools),
  hotkeyFormatter: (hotkey: any) => hotkey.join(" "),
});

const slots = useSlots();
const { initialValue, editable } = toRefs(props);

const emit = defineEmits<{
  (e: "change", content: string): void;
}>();

const extensions = [
  StarterKit.configure({
    // eslint-disable-next-line no-undefined
    bold: props.disabledTools.bold ? false : undefined,
    // eslint-disable-next-line no-undefined
    italic: props.disabledTools.italic ? false : undefined,
    // eslint-disable-next-line no-undefined
    bulletList: props.disabledTools.bulletList ? false : undefined,
    // eslint-disable-next-line no-undefined
    orderedList: props.disabledTools.orderedList ? false : undefined,
    // eslint-disable-next-line no-undefined
    heading: props.disabledTools.heading ? false : undefined,
  }),
  ...(props.disabledTools.underline ? [] : [UnderLine]),
  ...(props.disabledTools.textAlign
    ? []
    : [
        TextAlign.configure({
          types: ["heading", "paragraph"],
        }),
      ]),
];

const editor = useEditor({
  content: props.initialValue,
  editable: props.editable,
  extensions,
  onUpdate: () => emit("change", editor.value?.getHTML() || ""),
});

const maxHeight = computed(() =>
  props.maxHeight ? `${props.maxHeight}px` : "initial"
);

watch(initialValue, () => {
  if (!editor.value) {
    return;
  }

  editor.value.commands.setContent(initialValue.value);
});

watch(editable, (value) => {
  if (!editor.value) {
    return;
  }

  editor.value.setEditable(value);
});

onMounted(async () => {
  if (props.editable) {
    if (!editor.value) {
      return;
    }

    await new Promise((r) => setTimeout(r, 0));
    editor.value.commands.focus();
  }
});

const hasCustomToolbar = slots.customToolbar;
</script>

<template>
  <div class="editor-wrapper">
    <Transition name="expand" :css="!hasCustomToolbar">
      <div
        v-if="editor && editable"
        :class="{ 'embedded-toolbar': !hasCustomToolbar }"
      >
        <RichTextEditorBaseToolbar
          :editor="editor"
          :disabled-tools="disabledTools"
        >
          <template #default="{ tools }">
            <slot name="customToolbar" :editor="editor" :tools="tools">
              <RichTextEditorToolbar
                :editor="editor"
                :tools="tools"
                :hotkey-formatter="hotkeyFormatter"
              />
            </slot>
          </template>
        </RichTextEditorBaseToolbar>
      </div>
    </Transition>

    <EditorContent
      class="rich-text-editor"
      :editor="editor"
      :class="{ editable }"
    />
  </div>
</template>

<style lang="postcss" scoped>
.editor-wrapper {
  height: 100%;

  --toolbar-height: 48px;
  --rich-text-editor-font-size: 12;
}

.embedded-toolbar {
  height: var(--toolbar-height);
  border-bottom: 1px solid var(--knime-silver-sand);
  padding: 0 4px;
  background: var(--knime-white);
  overscroll-behavior: contain;
  overflow-x: auto;
  white-space: pre;
  -ms-overflow-style: none; /* needed to hide scroll bar in edge */
  scrollbar-width: none; /* for firefox */
  &::-webkit-scrollbar {
    display: none;
  }
}

.expand-enter-active,
.expand-leave-active {
  transition: all 0.15s ease;
}

.expand-enter-from,
.expand-leave-to {
  height: 0;
  opacity: 0;
}

.expand-enter-to,
.expand-leave-from {
  height: var(--toolbar-height);
  opacity: 1;
}

.rich-text-editor {
  height: 100%;
  max-height: v-bind("maxHeight");
  overflow-y: auto;

  &.editable {
    cursor: text;
    background: var(--knime-white);
  }

  /* stylelint-disable-next-line selector-class-pattern */
  & :deep(.ProseMirror) {
    height: 100%;
    font-size: calc(var(--rich-text-editor-font-size) * 1px);
    padding: v-bind("compact ? '4px' : '16px'");
    color: var(--knime-black);

    &:focus-visible,
    &:focus {
      outline: transparent;
    }

    & p {
      margin: 0 0 6px;
      padding: 0;
      line-height: 1.44;
    }

    & blockquote {
      margin: 0 0 6px 12px;
      position: relative;

      &::before {
        position: absolute;
        content: "";
        left: -12px;
        height: 100%;
        width: 4px;
        background-color: var(--knime-silver-sand);
        border-radius: 4px;
      }

      & p:last-child {
        padding-bottom: 0;
      }
    }

    & h1 {
      font-size: 48px;
      margin: 32px 0 16px;
    }

    & h2 {
      font-size: 36px;
      margin: 24px 0 12px;
    }

    & h3 {
      font-size: 30px;
      margin: 20px 0 10px;
    }

    & h4 {
      font-size: 24px;
      margin: 16px 0 8px;
    }

    & h5 {
      font-size: 18px;
      margin: 12px 0 6px;
    }

    & h6 {
      font-size: 15px;
      margin: 10px 0 5px;
    }

    & h1:first-child,
    & h2:first-child,
    & h3:first-child,
    & h4:first-child,
    & h5:first-child,
    & h6:first-child {
      margin-top: 0;
    }

    & hr {
      border: none;
      border-top: 1px solid var(--knime-silver-sand);
      margin: 6px 0;
    }

    & :not(pre) > code {
      padding: 0 2px;
      font-family: "Roboto Mono", monospace;
      border: 1px solid var(--knime-silver-sand);
      background: var(--knime-gray-light-semi);
      box-decoration-break: clone;
    }

    & pre {
      background: var(--knime-gray-light-semi);
      border: 1px solid var(--knime-silver-sand);
      font-family: "Roboto Mono", monospace;
      padding: 8px 12px;
      line-height: 1.44;

      & > code {
        color: inherit;
        padding: 0;
        background: none;
      }
    }

    & ul,
    & ol {
      padding-left: 20px;

      &:first-child {
        margin-top: 0;
      }
    }

    & a {
      color: var(--knime-cornflower);
    }
  }
}
</style>
