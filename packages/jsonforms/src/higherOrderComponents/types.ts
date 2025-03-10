import type {
  Component,
  ComputedOptions,
  EmitsOptions,
  MethodOptions,
} from "vue";
import type { RankedTester } from "@jsonforms/core";
import type { RendererProps } from "@jsonforms/vue";

export type ComponentParams = {
  props: Record<string, any>; // TODO: replace any
  slots: Record<string, any>; // TODO: replace any
};

export type ParameterizedComponent<T extends ComponentParams> = Component<
  T["props"], // props
  unknown, // bindings
  unknown, // data
  ComputedOptions, // computed
  MethodOptions, // methods
  EmitsOptions | Record<string, any[]>, // emits // TODO: replace any
  T["slots"] // slots
>;

export type RendererParams = {
  props: RendererProps;
  slots: ComponentParams;
};

export type NamedTester = { tester: RankedTester; name: string };

export type NamedRenderer = NamedTester & { renderer: unknown };
