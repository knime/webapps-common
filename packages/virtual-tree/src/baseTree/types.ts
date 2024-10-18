import type { FunctionalComponent, SVGAttributes, Slots } from "vue";
import type { JSX } from "vue/jsx-runtime";

import type { BaseTreeNode } from "./baseTreeNode";
import type { TypeWithNull, TypeWithUndefined } from "./utils/types";

type NodeKey = string | number;

/** source tree data, requires name and key */
interface TreeNodeOptions {
  nodeKey: NodeKey;
  name: string;
  showCheckbox?: boolean;
  hasChildren?: boolean;
  customSlot?: string;
  icon?: FunctionalComponent<SVGAttributes>;
  children?: TreeNodeOptions[];
  [key: string]: any;
}

interface TreeNodeInstance {
  rawNode: TreeNodeOptions;
  halfChecked: () => boolean;
}

type KeyNodeMap = Record<NodeKey, BaseTreeNode>;

interface EventParams {
  state: boolean;
  node: BaseTreeNode;
  source?: "api" | "click" | "key";
}

interface SelectEventParams {
  preSelectedNode: TypeWithUndefined<BaseTreeNode>;
  node: TypeWithUndefined<BaseTreeNode>;
}

interface FocusEventParams {
  node: TypeWithNull<BaseTreeNode>;
}

interface KeydownEvent {
  event: KeyboardEvent;
  node: BaseTreeNode;
}

type RenderNodeFunc = (node: BaseTreeNode) => JSX.Element;
type RenderIconFunc = (params: {
  node: BaseTreeNode;
  loading: boolean;
  expanded: boolean;
}) => JSX.Element;
type LoadDataFunc = (
  node: BaseTreeNode,
  callback: (children: TreeNodeOptions[]) => void,
) => void;

type TreeContext = Readonly<{
  renderNode: TypeWithUndefined<RenderNodeFunc>;
  renderIcon: TypeWithUndefined<RenderIconFunc>;
  slots: Slots;
  expandedKeys: Set<NodeKey>;
  getSelectedNode: () => TypeWithUndefined<BaseTreeNode>;
  getCheckedNodes: () => BaseTreeNode[];
  getHalfCheckedNodes: () => BaseTreeNode[];
  getExpandedKeys: () => NodeKey[];
  toggleExpand: (nodeKey: NodeKey, state?: boolean) => void;
  loadChildren: (nodeKey: NodeKey) => void;
  clearChildren: (nodeKey: NodeKey) => void;
}>;

export type {
  BaseTreeNode,
  TreeNodeOptions,
  NodeKey,
  TreeNodeInstance,
  KeyNodeMap,
  EventParams,
  FocusEventParams,
  SelectEventParams,
  RenderNodeFunc,
  RenderIconFunc,
  LoadDataFunc,
  KeydownEvent,
  TreeContext,
};
