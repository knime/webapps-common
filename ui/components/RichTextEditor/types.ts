import type { FunctionalComponent, SVGAttributes } from "vue";

interface ToolbarItem {
  id: string;
  name: string;
  icon: FunctionalComponent<SVGAttributes>;
  hotkey: Array<string>;
  onClick: () => void;
  active?: () => boolean;
}

export type EditorTools = Array<ToolbarItem>;
