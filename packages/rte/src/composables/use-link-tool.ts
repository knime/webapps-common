import type { Editor } from "@tiptap/vue-3";
import { ref } from "vue";

export const useLinkTool = ({ editor }: { editor: Editor }) => {
  const showCreateLinkModal = ref(false);
  const text = ref("");
  const url = ref("");
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
    showCreateLinkModal.value = true;
  };

  const removeLink = () => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();

    showCreateLinkModal.value = false;
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

  const addLink = (text: string, urlText: string) => {
    editor.chain().focus().extendMarkRange("link").unsetLink().run();

    if (urlText) {
      const containsHttp = ["http://", "https://"].some((protocol) =>
        urlText.includes(protocol),
      );
      const url = containsHttp ? urlText : `https://${urlText}`;

      addCustomLink({
        isEditing: isReplacingText.value,
        urlText,
        url,
        text,
      });
    }

    showCreateLinkModal.value = false;
    isReplacingText.value = false;
  };

  const cancelAddLink = () => {
    showCreateLinkModal.value = false;
    isReplacingText.value = false;
  };

  return {
    onLinkToolClick,
    addLink,
    removeLink,
    cancelAddLink,
    showCreateLinkModal,
    isReplacingText,
    url,
    text,
  };
};
