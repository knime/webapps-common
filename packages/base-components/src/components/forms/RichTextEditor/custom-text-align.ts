import TextAlign from "@tiptap/extension-text-align";

export const CustomTextAlign = TextAlign.extend({
  addKeyboardShortcuts() {
    const canActivate = () => {
      return !(
        this.editor.isActive("bulletList") ||
        this.editor.isActive("orderedList")
      );
    };

    return {
      "Mod-Shift-l": () =>
        canActivate() && this.editor.commands.setTextAlign("left"),
      "Mod-Shift-e": () =>
        canActivate() && this.editor.commands.setTextAlign("center"),
      "Mod-Shift-r": () =>
        canActivate() && this.editor.commands.setTextAlign("right"),
    };
  },
});
