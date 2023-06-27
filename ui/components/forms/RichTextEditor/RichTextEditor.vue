<script setup lang="ts">
import { computed, onMounted, toRefs, useSlots, watch, nextTick } from "vue";
import { EditorContent, useEditor, type AnyExtension } from "@tiptap/vue-3";
import UnderLine from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";

import RichTextEditorBaseToolbar from "./RichTextEditorBaseToolbar.vue";
import RichTextEditorToolbar from "./RichTextEditorToolbar.vue";
import type { EnabledTools } from "./types";
import { CustomTextAlign } from "./custom-text-align";

type EnabledToolsPropType =
  | EnabledTools
  | ({ [key in keyof EnabledTools]: never } & { all: boolean });

interface Props {
  modelValue: string;
  editable?: boolean;
  compact?: boolean;
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
   * Tools that should be enabled. By default all tools are disabled and you
   * have to opt-in to use them
   */
  enabledTools?: EnabledToolsPropType;
  /**
   * Function to format the display value of each tool's hotkeys as a title when hovered.
   * Receives as parameter the key combinations of each tool and should return
   * the string to be displayed in the title
   * @param hotkey
   */
  hotkeyFormatter?: (hotkey: Array<string>) => string;

  customExtensions?: Array<AnyExtension>;
  /**
   * Whether to automatically focus the editor on mount. Also applies when the
   * editable prop changes. True by default
   */
  autofocus?: boolean;
  /**
   * Whether to disable the expand transition when the editor goes into edit mode.
   * False by default
   */
  disableEditableTransition?: boolean;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  compact: false,
  minHeight: null,
  maxHeight: null,
  enabledTools: () => ({} as EnabledToolsPropType),
  hotkeyFormatter: (hotkey: any) => hotkey.join(" "),
  customExtensions: () => [] as Array<AnyExtension>,
  autofocus: true,
  disableEditableTransition: false,
});

const slots = useSlots();
const { modelValue, editable } = toRefs(props);

const emit = defineEmits<{
  (e: "update:modelValue", content: string): void;
}>();

const isToolEnabled = (toolName: keyof EnabledTools) => {
  if ("all" in props.enabledTools) {
    return true;
  }

  return Boolean(props.enabledTools[toolName]);
};

const extensions = [
  StarterKit.configure({
    // eslint-disable-next-line no-undefined
    bold: isToolEnabled("bold") ? undefined : false,
    // eslint-disable-next-line no-undefined
    italic: isToolEnabled("italic") ? undefined : false,
    // eslint-disable-next-line no-undefined
    bulletList: isToolEnabled("bulletList") ? undefined : false,
    // eslint-disable-next-line no-undefined
    orderedList: isToolEnabled("orderedList") ? undefined : false,
    // eslint-disable-next-line no-undefined
    heading: isToolEnabled("heading") ? undefined : false,
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
const hasTools = computed(() => Object.keys(props.enabledTools).length !== 0);
</script>

<template>
  <div class="editor-wrapper">
    <Transition
      v-if="hasTools"
      name="expand"
      :css="!hasCustomToolbar && !disableEditableTransition"
    >
      <div
        v-if="editor && editable"
        :class="{ 'embedded-toolbar': !hasCustomToolbar }"
      >
        <RichTextEditorBaseToolbar
          :editor="editor"
          :enabled-tools="enabledTools"
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

    /* stylelint-disable-next-line selector-class-pattern */
    & :deep(.ProseMirror) {
      min-height: v-bind("minHeight");
    }
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

    @mixin rich-text-editor-headings;
    @mixin rich-text-editor-hr;
    @mixin rich-text-editor-p;
    @mixin rich-text-editor-blockquote;
    @mixin rich-text-editor-code;
    @mixin rich-text-editor-lists;
    @mixin rich-text-editor-links;
  }
}
</style>
