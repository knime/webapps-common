<script setup lang="ts">
import { computed, nextTick, onMounted, toRefs, useSlots, watch } from "vue";
import UnderLine from "@tiptap/extension-underline";
import StarterKit from "@tiptap/starter-kit";
import { type AnyExtension, EditorContent, useEditor } from "@tiptap/vue-3";

import { navigatorUtils } from "@knime/utils";

import type { BaseExtensionsConfig } from "../types";
import { CustomHardBreak } from "../utils/custom-hard-break";
import {
  CustomLink,
  type LinkToolOptions,
  defaultLinkToolOptions,
  validateURL,
} from "../utils/custom-link";
import { CustomTextAlign } from "../utils/custom-text-align";
import { SmallText } from "../utils/paragraphTextStyle/extension";

import CreateLinkModal from "./CreateLinkModal.vue";
import RichTextEditorBaseToolbar from "./RichTextEditorBaseToolbar.vue";
import RichTextEditorToolbar from "./RichTextEditorToolbar.vue";

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
   * Custom extensions that you want to use for the editor
   */
  customExtensions?: Array<AnyExtension>;
  /**
   * Whether to automatically focus the editor on mount. Also applies when the
   * editable prop changes. False by default
   */
  autofocus?: boolean;
  withBorder?: boolean;
  /**
   * Whether the editor is in a disabled state. This state changes its style, sets the
   * editor to non-editable and hides the toolbar. In the disabled state, the editor won't
   * react to changes of the editable prop.
   */
  disabled?: boolean;
  /**
   * Only used if the link tool is enabled. If not set, the url will not be checked.
   * @param url
   */
  linkToolOptions?: LinkToolOptions;
}

const props = withDefaults(defineProps<Props>(), {
  editable: true,
  minHeight: null,
  maxHeight: null,
  baseExtensions: () => ({}) as BaseExtensions,
  hotkeyFormatter: (hotkey: string[]) => {
    const MacOSkeyMap: Record<string, string> = {
      Shift: "⇧",
      Ctrl: "⌘",
      Alt: "⌥",
    };

    const mapSymbols = (key: string) => MacOSkeyMap[key] || key;
    const identityFn = (value: any) => value;

    return (
      hotkey
        // map only for mac the symbols that should be displayed differently
        .map(navigatorUtils.isMac() ? mapSymbols : identityFn)
        .join(" ")
    );
  },
  customExtensions: () => [] as Array<AnyExtension>,
  autofocus: false,
  withBorder: true,
  disabled: false,
  linkToolOptions: () => defaultLinkToolOptions,
});

const slots = useSlots();
const {
  modelValue,
  editable,
  disabled,
  baseExtensions,
  customExtensions,
  autofocus,
} = toRefs(props);

const emit = defineEmits<{
  (e: "update:modelValue", content: string): void;
  (e: "blur"): void;
}>();

const isToolEnabled = (extensionName: keyof BaseExtensionsConfig) => {
  if ("all" in baseExtensions.value) {
    return true;
  }

  return Boolean(baseExtensions.value[extensionName]);
};

const getStarterKitExtensionConfig = (
  extensionName: keyof BaseExtensionsConfig,
): false | undefined | Partial<any> => {
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
    ...(isToolEnabled("paragraphTextStyle") && { paragraph: false }),
    hardBreak: false,
  }),
  ...(isToolEnabled("underline") ? [UnderLine] : []),
  ...(isToolEnabled("paragraphTextStyle") ? [SmallText] : []),
  ...(isToolEnabled("textAlign")
    ? [
        CustomTextAlign.configure({
          types: [
            baseExtensions.value.heading ? "heading" : "",
            "paragraph",
          ].filter(Boolean),

          alignments: ["left", "right", "center"],
        }),
      ]
    : []),
  ...(isToolEnabled("link")
    ? [CustomLink.configure({ validate: validateURL })]
    : []),

  CustomHardBreak,

  ...customExtensions.value,
];

const editor = useEditor({
  content: modelValue.value,
  editable: editable.value && !disabled.value,
  autofocus: autofocus.value,
  extensions,
  onUpdate: () => emit("update:modelValue", editor.value?.getHTML() ?? ""),
  onBlur: () => emit("blur"),
});

const minHeight = computed(() =>
  props.minHeight ? `${props.minHeight}px` : "initial",
);

const focus = () => {
  editor.value?.commands?.focus?.();
};

defineExpose({ focus });

const maxHeight = computed(() =>
  props.maxHeight ? `${props.maxHeight}px` : "initial",
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

watch(
  [editable, disabled],
  ([newEditable, newDisabled], [oldEditable, oldDisabled]) => {
    if (!editor.value) {
      return;
    }
    const oldValue = oldEditable && !oldDisabled;
    const newValue = newEditable && !newDisabled;
    if (oldValue === newValue) {
      return;
    }

    editor.value.setEditable(newValue);

    if (props.autofocus) {
      focus();
    }
  },
);

onMounted(async () => {
  if (props.editable && props.autofocus) {
    await nextTick();
    focus();
  }
});

const hasCustomToolbar = slots.customToolbar;
const hasTools = computed(() => Object.keys(props.baseExtensions).length);
</script>

<template>
  <div :class="['editor-wrapper', { 'with-border': withBorder, disabled }]">
    <Transition v-if="hasTools" name="expand" :css="!hasCustomToolbar">
      <div
        v-if="editor && editable && !disabled"
        :class="{ 'embedded-toolbar': !hasCustomToolbar }"
      >
        <RichTextEditorBaseToolbar
          :editor="editor"
          :base-extensions="baseExtensions"
          :link-tool-options="linkToolOptions"
        >
          <template #default="{ tools }">
            <slot
              name="customToolbar"
              :editor="editor"
              :tools="tools"
              :hotkey-formatter="hotkeyFormatter"
            >
              <RichTextEditorToolbar
                :editor="editor"
                :tools="tools"
                :hotkey-formatter="hotkeyFormatter"
              />
            </slot>
          </template>
          <template #linkModal="{ linkTool }">
            <slot name="linkModal" :link-tool="linkTool">
              <CreateLinkModal
                v-if="isToolEnabled('link') && linkTool"
                v-bind="linkTool.props"
                v-on="linkTool.events"
              />
            </slot>
          </template>
        </RichTextEditorBaseToolbar>
      </div>
    </Transition>

    <EditorContent
      class="rich-text-editor"
      :editor="editor"
      :class="{ editable: editable && !disabled }"
    />
  </div>
</template>

<style lang="postcss" scoped>
@import url("@knime/styles/css/rich-text-editor.css");

.editor-wrapper {
  --toolbar-height: 48px;
  --rich-text-editor-font-size: 13px;
  --rich-text-editor-small-font-size: 7px;
  --rich-text-editor-padding: 10px;

  &.with-border {
    border: 1px solid var(--knime-stone-gray);
    background-color: var(--theme-input-field-background-color);

    /* stylelint-disable-next-line selector-class-pattern */
    &:has(.ProseMirror-focused) {
      border-color: var(--knime-masala);
    }
  }

  &.disabled {
    opacity: 0.5;
  }
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

  & :deep(.small-text) {
    font-size: var(--rich-text-editor-small-font-size);
  }
}
</style>
