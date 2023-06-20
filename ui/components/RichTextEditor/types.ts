import type { FunctionalComponent, SVGAttributes } from "vue";

export interface EditorToolItem {
  id: string;
  name: string;
  icon: FunctionalComponent<SVGAttributes>;
  hotkey: Array<string>;
  onClick: () => void;
  active?: () => boolean;
}

export type EditorTools = Array<EditorToolItem>;

export type EnabledTools = {
  bold?: true;
  italic?: true;
  underline?: true;
  textAlign?: true;
  bulletList?: true;
  orderedList?: true;
  heading?: true;
};
