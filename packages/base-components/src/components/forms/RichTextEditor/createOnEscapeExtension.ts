import { Extension } from "@tiptap/vue-3";

/**
 * TODO: Remove and resolve properly with https://knime-com.atlassian.net/browse/UIEXT-1461-
 */
export default (onEscape: () => boolean) =>
  Extension.create({
    name: "OverrideEscape",
    addKeyboardShortcuts() {
      return {
        Escape: onEscape,
      };
    },
  });
