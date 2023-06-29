<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";

import BoldIcon from "../../../assets/img/icons/bold.svg";
import ItalicIcon from "../../../assets/img/icons/italic.svg";
import UnderlineIcon from "../../../assets/img/icons/underline.svg";
import BulletListIcon from "../../../assets/img/icons/unordered-list.svg";
import OrderedListIcon from "../../../assets/img/icons/ordered-list.svg";
import AlignLeftIcon from "../../../assets/img/icons/align-left.svg";
import AlignCenterIcon from "../../../assets/img/icons/align-center.svg";
import AlignRightIcon from "../../../assets/img/icons/align-right.svg";
import BlockquoteIcon from "../../../assets/img/icons/blockquote.svg";
import CodeIcon from "../../../assets/img/icons/code-html.svg";
import StrikeThroughIcon from "../../../assets/img/icons/strikethrough.svg";
import DividerIcon from "../../../assets/img/icons/divider.svg";

import type {
  BaseExtensionsConfig,
  EditorTools,
  EditorToolItem,
} from "./types";

interface Props {
  editor: Editor;
  baseExtensions: BaseExtensionsConfig | { all: true };
}

const props = defineProps<Props>();

const registerTool = (
  toolName: keyof BaseExtensionsConfig,
  tool: EditorToolItem
) => {
  if ("all" in props.baseExtensions) {
    return [tool];
  }

  return props.baseExtensions[toolName] ? [tool] : [];
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
    id: "bullet-list",
    name: "Bullet list",
    icon: BulletListIcon,
    hotkey: ["Ctrl", "Shift", "8"],
    active: () => props.editor.isActive("bulletList"),
    onClick: () => {
      props.editor
        .chain()
        .focus()
        .setTextAlign("left")
        .toggleBulletList()
        .run();
    },
  }),

  ...registerTool("orderedList", {
    id: "ordered-list",
    name: "Ordered list",
    icon: OrderedListIcon,
    hotkey: ["Ctrl", "Shift", "7"],
    active: () => props.editor.isActive("orderedList"),
    onClick: () =>
      props.editor
        .chain()
        .focus()
        .setTextAlign("left")
        .toggleOrderedList()
        .run(),
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
