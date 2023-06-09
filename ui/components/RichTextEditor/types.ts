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

export type DisabledTools = {
  bold?: boolean;
  italic?: boolean;
  underline?: boolean;
  textAlign?: boolean;
  bulletList?: boolean;
  orderedList?: boolean;
  heading?: boolean;
};
