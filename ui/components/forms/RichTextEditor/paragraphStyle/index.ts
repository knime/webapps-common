import type { Editor } from "@tiptap/vue-3";
import type { EditorToolItem } from "../types";
import type { Level } from "@tiptap/extension-heading";

export type ParagrapsStyleId = Level | "small" | "standard";

const clearHeading = (editor: Editor) => {
  for (let i = 1; i <= 6; i++) {
    if (editor.isActive("heading", { level: i })) {
      editor
        .chain()
        .focus()
        .toggleHeading({ level: i as any })
        .run();
      break;
    }
  }
};

const getHeadingOptionChild = (level: Level, getEditor: () => Editor) => ({
  item: { text: `Heading ${level}` },
  id: level,
  active: () => getEditor().isActive("heading", { level }),
});

export default (getEditor: () => Editor) => {
  return {
    children: [
      {
        item: { text: "Standard" },
        id: "standard",
      },
      {
        item: { text: "Small text" },
        id: "small",
        active: () => getEditor().isActive({ fontSize: true }),
      },
      ...Array.from({ length: 6 }, (_, i) =>
        getHeadingOptionChild((i + 1) as Level, getEditor),
      ),
    ],
    onChildClick: (childId: ParagrapsStyleId) => {
      const editor = getEditor();
      if (childId === "standard") {
        clearHeading(editor);
        editor.chain().focus().unsetSmallText().run();
        return;
      }
      if (childId === "small") {
        clearHeading(editor);
        editor.chain().focus().setSmallText().run();
        return;
      }
      editor.chain().focus().toggleHeading({ level: childId }).run();
    },
  } satisfies Pick<
    EditorToolItem<ParagrapsStyleId>,
    "onChildClick" | "children"
  >;
};
