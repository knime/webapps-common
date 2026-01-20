import type { InjectionKey } from "vue";

export const ListDepthKey: InjectionKey<number> = Symbol("ListDepth");

export type ParentItemApi = {
  setHasActiveChild: (value: boolean) => void;
};
export const ParentItemKey: InjectionKey<ParentItemApi> = Symbol("ParentItem");

export type ChildItemApi = {
  reportActive: (id: symbol, active: boolean) => void;
};
export const ChildItemKey: InjectionKey<ChildItemApi> = Symbol("ChildItem");
