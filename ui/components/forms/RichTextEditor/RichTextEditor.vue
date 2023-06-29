<script setup lang="ts">
import { computed, onMounted, toRefs, useSlots, watch, nextTick } from "vue";
import { EditorContent, useEditor, type AnyExtension } from "@tiptap/vue-3";
import UnderLine from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import RichTextEditorBaseToolbar from "./RichTextEditorBaseToolbar.vue";
import RichTextEditorToolbar from "./RichTextEditorToolbar.vue";
import type { BaseExtensionsConfig } from "./types";
import { CustomTextAlign } from "./custom-text-align";

type BaseExtensions =
  | BaseExtensionsConfig
  | ({ [key in keyof BaseExtensionsConfig]: never } & { all: boolean });

interface Props {
  modelValue: string;
  editable?: boolean;
  /**
   * Min height the editor should have. By default this is unset, so
   * the editor will fir the min content
   */
  minHeight?: number | null;
  /**
   * Max height the editor can have. The editor container will grow up to this
   * value before it starts to overflow the content. By default this is unset, so
   * the editor will grow with the content
   */
  maxHeight?: number | null;
  /**
   * Extensions that should be enabled. By default all are disabled and you
   * have to opt-in to use them
   */
  baseExtensions?: BaseExtensions;
  /**
   * Function to format the display value of each tool's hotkeys as a title when hovered.
   * Receives as parameter the key combinations of each tool and should return
   * the string to be displayed in the title
   * @param hotkey
   */
  hotkeyFormatter?: (hotkey: Array<string>) => string;
  /**
   * Extra extensions that you want to use for the editor
   */
  customExtensions?: Array<AnyExtension>;
  /**
   * Whether to automatically focus the editor on mount. Also applies when the
   * editable prop changes. False by default
   */
  autofocus?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  minHeight: null,
  maxHeight: null,
  baseExtensions: () => ({} as BaseExtensions),
  hotkeyFormatter: (hotkey: any) => hotkey.join(" "),
  customExtensions: () => [] as Array<AnyExtension>,
  autofocus: false,
});

const slots = useSlots();
const { modelValue, editable } = toRefs(props);

const emit = defineEmits<{
  (e: "update:modelValue", content: string): void;
}>();

const isToolEnabled = (extensionName: keyof BaseExtensionsConfig) => {
  if ("all" in props.baseExtensions) {
    return true;
  }

  return Boolean(props.baseExtensions[extensionName]);
};

const getStarterKitExtensionConfig = (
  extensionName: keyof BaseExtensionsConfig
) => {
  // eslint-disable-next-line no-undefined
  return isToolEnabled(extensionName) ? undefined : false;
};

const extensions = [
  StarterKit.configure({
    bold: getStarterKitExtensionConfig("bold"),
    italic: getStarterKitExtensionConfig("italic"),
    bulletList: getStarterKitExtensionConfig("bulletList"),
    orderedList: getStarterKitExtensionConfig("orderedList"),
    heading: getStarterKitExtensionConfig("heading"),
    blockquote: getStarterKitExtensionConfig("blockquote"),
    code: getStarterKitExtensionConfig("code"),
    codeBlock: getStarterKitExtensionConfig("codeBlock"),
    horizontalRule: getStarterKitExtensionConfig("horizontalRule"),
    strike: getStarterKitExtensionConfig("strike"),
  }),
  ...(isToolEnabled("underline") ? [UnderLine] : []),

  ...(isToolEnabled("textAlign")
    ? [
        CustomTextAlign.configure({
          types: ["heading", "paragraph"],
          alignments: ["left", "right", "center"],
        }),
      ]
    : []),

  ...props.customExtensions,
];

const editor = useEditor({
  content: props.modelValue,
  editable: props.editable,
  autofocus: props.autofocus,
  extensions,
  onUpdate: () => emit("update:modelValue", editor.value?.getHTML() ?? ""),
});

const minHeight = computed(() =>
  props.minHeight ? `${props.minHeight}px` : "initial"
);

const focus = () => {
  editor.value?.commands?.focus?.();
};

defineExpose({ focus });

const maxHeight = computed(() =>
  props.maxHeight ? `${props.maxHeight}px` : "initial"
);

watch(modelValue, (_value) => {
  if (!editor.value) {
    return;
  }

  const isSame = editor.value.getHTML() === _value;

  if (isSame) {
    return;
  }

  editor.value.commands.setContent(_value);
});

watch(editable, (value) => {
  if (!editor.value) {
    return;
  }

  editor.value.setEditable(value);

  if (props.autofocus) {
    focus();
  }
});

onMounted(async () => {
  if (props.editable && props.autofocus) {
    await nextTick();
    focus();
  }
});

const hasCustomToolbar = slots.customToolbar;
const hasTools = computed(() => Object.keys(props.baseExtensions).length !== 0);
</script>

<template>
  <div class="editor-wrapper">
    <Transition v-if="hasTools" name="expand" :css="!hasCustomToolbar">
      <div
        v-if="editor && editable"
        :class="{ 'embedded-toolbar': !hasCustomToolbar }"
      >
        <RichTextEditorBaseToolbar
          :editor="editor"
          :base-extensions="baseExtensions"
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
@import url("./styles.css");

.editor-wrapper {
  height: 100%;

  --toolbar-height: 48px;
  --rich-text-editor-font-size: 12px;
  --rich-text-editor-padding: 4px;
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
  padding: var(--rich-text-editor-padding);

  &.editable {
    cursor: text;
    background: var(--knime-white);

    /* stylelint-disable-next-line selector-class-pattern */
    & :deep(.ProseMirror) {
      min-height: v-bind("minHeight");
    }
  }

  /* stylelint-disable-next-line selector-class-pattern */
  & :deep(.ProseMirror) {
    height: 100%;

    &:focus-visible,
    &:focus {
      outline: transparent;
    }

    @mixin rich-text-editor-styles;
  }
}
</style>
