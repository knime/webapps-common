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

import type { DisabledTools, EditorTools, EditorToolItem } from "./types";

interface Props {
  editor: Editor;
  disabledTools: DisabledTools;
}

const props = defineProps<Props>();

const registerTool = (
  isDisabled: boolean | undefined,
  tool: EditorToolItem
) => {
  return isDisabled ? [] : [tool];
};

const editorTools: EditorTools = [
  ...registerTool(props.disabledTools.bold, {
    id: "bold",
    name: "Bold",
    hotkey: ["Ctrl", "B"],
    icon: BoldIcon,
    active: () => props.editor.isActive("bold"),
    onClick: () => props.editor.chain().focus().toggleBold().run(),
  }),

  ...registerTool(props.disabledTools.italic, {
    id: "italic",
    name: "Italic",
    icon: ItalicIcon,
    hotkey: ["Ctrl", "I"],
    active: () => props.editor.isActive("italic"),
    onClick: () => props.editor.chain().focus().toggleItalic().run(),
  }),

  ...registerTool(props.disabledTools.underline, {
    id: "underline",
    name: "Underline",
    icon: UnderlineIcon,
    hotkey: ["Ctrl", "U"],
    active: () => props.editor.isActive("underline"),
    onClick: () => props.editor.chain().focus().toggleUnderline().run(),
  }),

  ...registerTool(props.disabledTools.bulletList, {
    id: "bullet-list",
    name: "Bullet list",
    icon: BulletListIcon,
    hotkey: ["Ctrl", "Shift", "8"],
    active: () => props.editor.isActive("bulletList"),
    onClick: () => props.editor.chain().focus().toggleBulletList().run(),
  }),

  ...registerTool(props.disabledTools.orderedList, {
    id: "ordered-list",
    name: "Ordered list",
    icon: OrderedListIcon,
    hotkey: ["Ctrl", "Shift", "7"],
    active: () => props.editor.isActive("orderedList"),
    onClick: () => props.editor.chain().focus().toggleOrderedList().run(),
  }),

  ...registerTool(props.disabledTools.textAlign, {
    id: "align-left",
    icon: AlignLeftIcon,
    name: "Align left",
    hotkey: ["Ctrl", "Shift", "L"],
    active: () => props.editor.isActive({ textAlign: "left" }),
    onClick: () => props.editor.chain().focus().setTextAlign("left").run(),
  }),

  ...registerTool(props.disabledTools.textAlign, {
    id: "align-center",
    icon: AlignCenterIcon,
    name: "Align center",
    hotkey: ["Ctrl", "Shift", "E"],
    active: () => props.editor.isActive({ textAlign: "center" }),
    onClick: () => props.editor.chain().focus().setTextAlign("center").run(),
  }),

  ...registerTool(props.disabledTools.textAlign, {
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
