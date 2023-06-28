import type { FunctionalComponent, SVGAttributes } from "vue";

export interface EditorToolItem {
  id: string;
  name: string;
  icon: FunctionalComponent<SVGAttributes>;
  hotkey: Array<string>;
  onClick: () => void;
  active?: () => boolean;
  disabled?: () => boolean;
}

export type EditorTools = Array<EditorToolItem>;

export type BaseExtensionsConfig = {
  bold?: true;
  italic?: true;
  underline?: true;
  textAlign?: true;
  bulletList?: true;
  orderedList?: true;
  heading?: true;
  blockquote?: true;
  code?: true;
  codeBlock?: true;
  horizontalRule?: true;
  strike?: true;
};
