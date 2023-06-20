<script setup lang="ts">
import type { Editor } from "@tiptap/vue-3";

import BoldIcon from "../../assets/img/icons/bold.svg";
import ItalicIcon from "../../assets/img/icons/italic.svg";
import UnderlineIcon from "../../assets/img/icons/underline.svg";
import BulletListIcon from "../../assets/img/icons/unordered-list.svg";
import OrderedListIcon from "../../assets/img/icons/ordered-list.svg";
import AlignLeftIcon from "../../assets/img/icons/align-left.svg";
import AlignCenterIcon from "../../assets/img/icons/align-center.svg";
import AlignRightIcon from "../../assets/img/icons/align-right.svg";

import type { EnabledTools, EditorTools, EditorToolItem } from "./types";

interface Props {
  editor: Editor;
  enabledTools: EnabledTools | { all: true };
}

const props = defineProps<Props>();

const registerTool = (toolName: keyof EnabledTools, tool: EditorToolItem) => {
  if ("all" in props.enabledTools) {
    return [tool];
  }

  return props.enabledTools[toolName] ? [tool] : [];
};

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
    onClick: () => props.editor.chain().focus().toggleBulletList().run(),
  }),

  ...registerTool("orderedList", {
    id: "ordered-list",
    name: "Ordered list",
    icon: OrderedListIcon,
    hotkey: ["Ctrl", "Shift", "7"],
    active: () => props.editor.isActive("orderedList"),
    onClick: () => props.editor.chain().focus().toggleOrderedList().run(),
  }),

  ...registerTool("textAlign", {
    id: "align-left",
    icon: AlignLeftIcon,
    name: "Align left",
    hotkey: ["Ctrl", "Shift", "L"],
    active: () => props.editor.isActive({ textAlign: "left" }),
    onClick: () => props.editor.chain().focus().setTextAlign("left").run(),
  }),

  ...registerTool("textAlign", {
    id: "align-center",
    icon: AlignCenterIcon,
    name: "Align center",
    hotkey: ["Ctrl", "Shift", "E"],
    active: () => props.editor.isActive({ textAlign: "center" }),
    onClick: () => props.editor.chain().focus().setTextAlign("center").run(),
  }),

  ...registerTool("textAlign", {
    id: "align-right",
    icon: AlignRightIcon,
    name: "Align right",
    hotkey: ["Ctrl", "Shift", "R"],
    active: () => props.editor.isActive({ textAlign: "right" }),
    onClick: () => props.editor.chain().focus().setTextAlign("right").run(),
  }),
];
</script>

<template>
  <slot :tools="editorTools" />
</template>
