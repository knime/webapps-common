import { computed, onMounted, onUnmounted, ref } from "vue";
import type { Editor } from "@tiptap/vue-3";

import { navigatorUtils } from "@knime/utils";

import type { LinkToolOptions } from "../utils/custom-link";

export const useLinkTool = ({
  editor,
  isRegistered,
  linkToolOptions,
}: {
  editor: Editor;
  isRegistered: boolean;
  linkToolOptions: LinkToolOptions;
}) => {
  if (!isRegistered) {
    return null;
  }

  const isActive = ref(false);
  const text = ref("");
  const url = ref("");
  const isEdit = computed(() => url.value !== "");
  const isReplacingText = ref(false);

  const onLinkToolClick = () => {
    const { view, state } = editor;
    const { from, to } = view.state.selection;

    const currentLink = editor.getAttributes("link").href;
    url.value = currentLink || "";

    if (currentLink) {
      const hasSelection = from !== to;
      if (hasSelection) {
        // manually update the cursor position to get the entire link text
        const newCursorPosition = from + Math.floor((to - from) / 2);
        editor.chain().focus().setTextSelection(newCursorPosition).run();
      }

      const textBefore =
        view.state.selection.$from.nodeBefore?.textContent ?? "";
      const textAfter = view.state.selection.$to.nodeAfter?.textContent ?? "";

      text.value = textBefore + textAfter;
    } else {
      text.value = state.doc.textBetween(from, to, "");
    }

    isReplacingText.value = Boolean(currentLink || text.value);
    isActive.value = true;
  };

  const onRemoveLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();

    isActive.value = false;
    isReplacingText.value = false;
  };

  const addCustomLink = ({
    isEditing,
    url,
    urlText,
    text,
  }: {
    isEditing: boolean;
    url: string;
    urlText: string;
    text: string;
  }) => {
    if (isEditing) {
      editor
        .chain()
        .focus()
        .setLink({ href: url })
        .command(({ tr }) => {
          tr.insertText(text || urlText);
          return true;
        })
        .run();
    } else {
      // TODO replace this rather complicated way to add a link once the tiptap bug is fixed
      const { view } = editor;
      const { from: startIndex } = view.state.selection;

      // escape link with space when creating a new link
      editor
        .chain()
        .focus()
        .insertContent([{ type: "text", text: " " }])
        .run();
      editor
        .chain()
        .focus()
        .insertContentAt(startIndex, [{ type: "text", text: text || urlText }])
        .run();

      const { from: endIndex } = view.state.selection;

      editor.commands.setTextSelection({
        from: startIndex,
        to: endIndex,
      });

      editor.chain().focus().setLink({ href: url }).run();
    }
  };

  const onAddLink = (text: string, urlText: string) => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();

    if (urlText) {
      const url = linkToolOptions.sanitizeUrlText?.(urlText) ?? urlText;

      addCustomLink({
        isEditing: isReplacingText.value,
        urlText,
        url,
        text,
      });
    }

    isActive.value = false;
    isReplacingText.value = false;
  };

  const onCancelAddLink = () => {
    isActive.value = false;
    isReplacingText.value = false;
  };

  /**
   * Handle custom hotkeys for link tool that are not supported by tiptap.
   */
  const onKeyDown = (event: KeyboardEvent) => {
    if (!editor?.isFocused) {
      return;
    }
    const ctrlPressed = event[navigatorUtils.getMetaOrCtrlKey()];
    if (ctrlPressed && event.key === "k") {
      onLinkToolClick();
    }
  };
  onMounted(() => {
    window.addEventListener("keydown", onKeyDown);
  });

  onUnmounted(() => {
    window.removeEventListener("keydown", onKeyDown);
  });

  return {
    onLinkToolClick,
    props: {
      url,
      text,
      isActive,
      isEdit,
      urlValidator: linkToolOptions.urlValidator,
    },
    events: {
      addLink: onAddLink,
      removeLink: onRemoveLink,
      cancelAddLink: onCancelAddLink,
    },
  };
};
