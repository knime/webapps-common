import { Plugin, PluginKey } from "@tiptap/pm/state";
import { getAttributes } from "@tiptap/core";
import type { Editor } from "@tiptap/vue-3";
import Link from "@tiptap/extension-link";

import { isMac } from "../../../util/isMac";
import { buildUrlRegex } from "../../../util/regex";

const getMetaOrCtrlKey = () => (isMac() ? "metaKey" : "ctrlKey");

interface CustomLinkOptions {
  isEditing: boolean;
  url: string;
  urlText: string;
  text: string;
}

export const URL_REGEX = buildUrlRegex();

export const addCustomLink = (
  editor: Editor,
  { isEditing, url, urlText, text }: CustomLinkOptions
) => {
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

/**
 * This is a workaround to support link open on Control + Click.
 *
 * It comes from https://github.com/ueberdosis/tiptap/issues/3389#issuecomment-1422608677 originally.
 */
export const ControlClickLink = Link.extend({
  addOptions() {
    return {
      ...this.parent?.(),
      openOnClick: false,
    };
  },

  addAttributes() {
    const modifier = isMac() ? "⌘" : "Ctrl +";

    return {
      ...this.parent?.(),

      title: {
        default: `Use "${modifier} click" to follow link`,
      },
    };
  },

  addProseMirrorPlugins() {
    const plugins: Plugin[] = this.parent?.() || [];

    const ctrlClickHandler = new Plugin({
      key: new PluginKey("handleControlClick"),
      props: {
        handleClick(view, pos, event) {
          const attrs = getAttributes(view.state, "link");
          const link = (event.target as HTMLElement)?.closest("a");

          const metaOrCtrlKeyPressed = event[getMetaOrCtrlKey()];

          if (metaOrCtrlKeyPressed && link && attrs.href) {
            window.open(attrs.href, attrs.target);

            return true;
          }

          return false;
        },
      },
    });

    plugins.push(ctrlClickHandler);

    return plugins;
  },
});
