import { type Component } from "vue";
import type { RankedTester } from "@jsonforms/core";
import type { RendererProps } from "@jsonforms/vue";

export type ComponentParams = {
  props: Record<string, any>;
  slots: Record<string, any>;
};

export type ParameterizedComponent<T extends ComponentParams> = Component<
  T["props"], // props
  any, // bindings
  any, // data
  any, // computed
  any, // methods
  any, // emits
  T["slots"] // slots
>;

export type RendererParams = {
  props: RendererProps;
  slots: any;
};

export type NamedTester = { tester: RankedTester; name: string };

export type NamedRenderer = NamedTester & { renderer: any };
