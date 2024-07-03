import type { MenuItem } from "@knime/components";
import type { FunctionalComponent, SVGAttributes } from "vue";

interface EditorToolItemBase {
  id: string;
  name: string;
  icon: FunctionalComponent<SVGAttributes>;
  hotkey?: Array<string>;
  active?: () => boolean;
  disabled?: () => boolean;
  secondary?: boolean;
}

export type EditorToolItem<T> = EditorToolItemBase &
  (
    | {
        children?: never;
        onChildClick?: never;
        onClick: () => void;
      }
    | {
        children: {
          item: MenuItem;
          id: T;
          active?: () => boolean;
          hotkey?: Array<string>;
        }[];
        onChildClick: (childId: T) => void;
        onClick?: never;
        secondary: true;
      }
  );

export type EditorTools = Array<EditorToolItem<any>>;

export type BaseExtensionsConfig = {
  bold?: true;
  italic?: true;
  underline?: true;
  textAlign?: true;
  bulletList?: true;
  orderedList?: true;
  heading?: true;
  paragraphTextStyle?: true;
  blockquote?: true;
  code?: true;
  codeBlock?: true;
  horizontalRule?: true;
  strike?: true;
};
