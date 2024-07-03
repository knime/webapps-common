<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";

import BoldIcon from "@knime/styles/img/icons/bold.svg";
import ItalicIcon from "@knime/styles/img/icons/italic.svg";
import UnderlineIcon from "@knime/styles/img/icons/underline.svg";
import BulletListIcon from "@knime/styles/img/icons/unordered-list.svg";
import OrderedListIcon from "@knime/styles/img/icons/ordered-list.svg";
import AlignLeftIcon from "@knime/styles/img/icons/align-left.svg";
import AlignCenterIcon from "@knime/styles/img/icons/align-center.svg";
import AlignRightIcon from "@knime/styles/img/icons/align-right.svg";
import ParagraphIcon from "@knime/styles/img/icons/text-style.svg";
import BlockquoteIcon from "@knime/styles/img/icons/blockquote.svg";
import CodeIcon from "@knime/styles/img/icons/code-html.svg";
import StrikeThroughIcon from "@knime/styles/img/icons/strikethrough.svg";
import DividerIcon from "@knime/styles/img/icons/divider.svg";

import getParagraphTextStyleChildTools, {
  type ParagraphTextStyleId,
} from "../utils/paragraphTextStyle";

import type {
  BaseExtensionsConfig,
  EditorTools,
  EditorToolItem,
} from "../types";

interface Props {
  editor: Editor;
  baseExtensions: BaseExtensionsConfig | { all: true };
}

const props = defineProps<Props>();

const registerTool = (
  toolName: keyof BaseExtensionsConfig,
  tool: EditorToolItem<any>,
) => {
  if ("all" in props.baseExtensions) {
    return [tool];
  }

  return props.baseExtensions[toolName] ? [tool] : [];
};

const isToolRegistered = (toolName: keyof BaseExtensionsConfig) => {
  if ("all" in props.baseExtensions) {
    return true;
  }

  return Boolean(props.baseExtensions[toolName]);
};

const isListActive = () =>
  props.editor.isActive("orderedList") || props.editor.isActive("bulletList");

const editorTools: EditorTools = [
  ...registerTool("bold", {
    id: "bold",
    name: "Bold",
    hotkey: ["Ctrl", "B"],
    icon: BoldIcon,
    active: () => props.editor.isActive("bold"),
    onClick: () => props.editor.chain().focus().toggleBold().run(),
  }),

  ...registerTool("italic", {
    id: "italic",
    name: "Italic",
    icon: ItalicIcon,
    hotkey: ["Ctrl", "I"],
    active: () => props.editor.isActive("italic"),
    onClick: () => props.editor.chain().focus().toggleItalic().run(),
  }),

  ...registerTool("underline", {
    id: "underline",
    name: "Underline",
    icon: UnderlineIcon,
    hotkey: ["Ctrl", "U"],
    active: () => props.editor.isActive("underline"),
    onClick: () => props.editor.chain().focus().toggleUnderline().run(),
  }),

  ...registerTool("bulletList", {
    id: "bulletList",
    name: "Bullet list",
    icon: BulletListIcon,
    hotkey: ["Ctrl", "Shift", "8"],
    active: () => props.editor.isActive("bulletList"),
    onClick: () => {
      const commandChain = props.editor.chain().focus();
      if (isToolRegistered("textAlign")) {
        commandChain.setTextAlign("left");
      }

      commandChain.toggleBulletList().run();
    },
  }),

  ...registerTool("orderedList", {
    id: "orderedList",
    name: "Ordered list",
    icon: OrderedListIcon,
    hotkey: ["Ctrl", "Shift", "7"],
    active: () => props.editor.isActive("orderedList"),
    onClick: () => {
      const commandChain = props.editor.chain().focus();
      if (isToolRegistered("textAlign")) {
        commandChain.setTextAlign("left");
      }

      commandChain.toggleOrderedList().run();
    },
  }),

  ...registerTool("textAlign", {
    id: "align-left",
    icon: AlignLeftIcon,
    name: "Align left",
    hotkey: ["Ctrl", "Shift", "L"],
    active: () =>
      !isListActive() && props.editor.isActive({ textAlign: "left" }),
    onClick: () => props.editor.chain().focus().setTextAlign("left").run(),
    disabled: () => isListActive(),
  }),

  ...registerTool("textAlign", {
    id: "align-center",
    icon: AlignCenterIcon,
    name: "Align center",
    hotkey: ["Ctrl", "Shift", "E"],
    active: () =>
      !isListActive() && props.editor.isActive({ textAlign: "center" }),
    onClick: () => props.editor.chain().focus().setTextAlign("center").run(),
    disabled: () => isListActive(),
  }),

  ...registerTool("textAlign", {
    id: "align-right",
    icon: AlignRightIcon,
    name: "Align right",
    hotkey: ["Ctrl", "Shift", "R"],
    active: () =>
      !isListActive() && props.editor.isActive({ textAlign: "right" }),
    onClick: () => props.editor.chain().focus().setTextAlign("right").run(),
    disabled: () => isListActive(),
  }),

  ...registerTool("paragraphTextStyle", {
    id: "paragraphTextStyle",
    icon: ParagraphIcon,
    name: "Text style",
    secondary: true,
    ...getParagraphTextStyleChildTools(() => props.editor),
  } satisfies EditorToolItem<ParagraphTextStyleId>),

  ...registerTool("blockquote", {
    id: "blockquote",
    icon: BlockquoteIcon,
    name: "Blockquote",
    active: () => props.editor.isActive("blockquote"),
    onClick: () => props.editor.chain().focus().toggleBlockquote().run(),
    secondary: true,
  }),

  ...registerTool("codeBlock", {
    id: "codeBlock",
    icon: CodeIcon,
    name: "Code block",
    hotkey: ["Ctrl", "Alt", "C"],
    active: () => props.editor.isActive("codeBlock"),
    onClick: () => props.editor.chain().focus().toggleCodeBlock().run(),
    secondary: true,
  }),

  ...registerTool("strike", {
    id: "strikethrough",
    icon: StrikeThroughIcon,
    name: "Strikethrough",
    hotkey: ["Ctrl", "Shift", "X"],
    active: () => props.editor.isActive("strike"),
    onClick: () => props.editor.chain().focus().toggleStrike().run(),
    secondary: true,
  }),

  ...registerTool("horizontalRule", {
    id: "horizontalRule",
    icon: DividerIcon,
    name: "Divider",
    active: () => false,
    onClick: () => props.editor.chain().focus().setHorizontalRule().run(),
    secondary: true,
  }),
];
</script>

<template>
  <slot :tools="editorTools" />
</template>
