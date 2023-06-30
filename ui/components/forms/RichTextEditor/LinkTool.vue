<script setup lang="ts">
import { ref } from "vue";
import type { Editor } from "@tiptap/vue-3";

import LinkIcon from "../../../assets/img/icons/link.svg";
import FunctionButton from "../../FunctionButton.vue";

import LinkModal from "./LinkModal.vue";
import { addCustomLink } from "./custom-link";

interface Props {
  editor: Editor;
  hotkeyFormatter: (hotkey: Array<string>) => string;
}

const props = defineProps<Props>();

const isLinkModalActive = ref(false);
const text = ref("");
const url = ref("");
const isEditingLink = ref(false);

const createLink = () => {
  const { view, state } = props.editor;
  const { from, to } = view.state.selection;

  const currentLink = props.editor.getAttributes("link").href;
  url.value = currentLink || "";

  if (currentLink) {
    const hasSelection = from !== to;
    if (hasSelection) {
      // manually update the cursor position to get the entire link text
      const newCursorPosition = from + Math.floor((to - from) / 2);
      props.editor.chain().focus().setTextSelection(newCursorPosition).run();
    }

    const textBefore = view.state.selection.$from.nodeBefore?.textContent ?? "";
    const textAfter = view.state.selection.$to.nodeAfter?.textContent ?? "";

    text.value = textBefore + textAfter;
  } else {
    text.value = state.doc.textBetween(from, to, "");
  }

  isEditingLink.value = currentLink || text.value;
  isLinkModalActive.value = true;
};

const addLink = (text: string, urlText: string) => {
  props.editor.chain().focus().extendMarkRange("link").unsetLink().run();

  if (urlText) {
    const containsHttp = ["http://", "https://"].some((protocol) =>
      urlText.includes(protocol)
    );
    const url = containsHttp ? urlText : `https://${urlText}`;

    addCustomLink(props.editor, {
      isEditing: isEditingLink.value,
      urlText,
      url,
      text,
    });
  }

  isLinkModalActive.value = false;
  isEditingLink.value = false;
};

const cancelAddLink = () => {
  isLinkModalActive.value = false;
  isEditingLink.value = false;
};
</script>

<template>
  <FunctionButton
    v-bind="$attrs"
    class="tool"
    :active="editor.isActive('link')"
    :title="hotkeyFormatter(['Ctrl', 'K'])"
    compact
    @click.stop="createLink"
  >
    <LinkIcon />
  </FunctionButton>

  <LinkModal
    :is-active="isLinkModalActive"
    :text="text"
    :url="url"
    @add-link="addLink"
    @cancel-add-link="cancelAddLink"
  />
</template>

<style lang="postcss" scoped></style>
