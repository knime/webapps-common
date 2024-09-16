import type { NodeKey, TreeNodeOptions } from "./types";
import type { TypeWithUndefined } from "./utils/types";
import { toRaw } from "vue";

export class BaseTreeNode {
  readonly key: NodeKey;
  readonly name: string;
  readonly level: number;
  loading = false;
  hasChildren = false;
  showCheckbox: TypeWithUndefined<boolean>;
  // eslint-disable-next-line no-use-before-define
  children: BaseTreeNode[] = [];
  parentKey: TypeWithUndefined<NodeKey>;
  parentKeys: NodeKey[] = [];
  origin: TreeNodeOptions;
  constructor(options: TreeNodeOptions, parent?: BaseTreeNode) {
    this.key = options.nodeKey;
    this.name = options.name;
    this.showCheckbox = options.showCheckbox;
    this.parentKey = parent?.key;
    this.parentKeys = parent ? [...parent.parentKeys, parent.key] : [];
    this.level = parent ? parent.level + 1 : 0;
    this.origin = toRaw(options);
  }
}
