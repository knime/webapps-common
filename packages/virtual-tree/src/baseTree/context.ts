import type { InjectionKey } from "vue";
import type { TreeContext } from "./types";

export const TreeInjectionKey: InjectionKey<TreeContext> =
  Symbol("TreeInjectionKey");
