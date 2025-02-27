import type { useJsonFormsControl } from "@jsonforms/vue";

import type { NamedTester, ParameterizedComponent } from "../types";

import type { ValidationSettings } from "./validation/types";

/**
 * The props that a control can have.
 * I.e., the props of the script setup vue components which are wrapped by modifiers.
 */
export type VueControlProps<D> = {
  control: {
    data: D;
    uischema: {
      providedOptions?: string[];
      id?: string;
    };
  } & Omit<ReturnType<typeof useJsonFormsControl>["control"]["value"], "data">;
  handleChange: (path: string, value: unknown) => void;
  changeValue: (newValue: D) => void;
  disabled: boolean;
  labelForId?: null;
} & ValidationSettings<D>;

/**
 * Optional slots that a control can have to render additional elements.
 */
export type ControlSlots = {
  buttons?: (props: {
    controlHTMLElement?: HTMLElement | null;
    hover: boolean;
  }) => unknown[];
  icon?: unknown;
};

export type VueControlParamsFromProps<P> = {
  props: P;
  slots: ControlSlots;
};

export type PropsToComponent<P extends Record<string, unknown>> =
  ParameterizedComponent<VueControlParamsFromProps<P>>;

export type VueControl<D> = PropsToComponent<VueControlProps<D>>;

export type VueControlRenderer = NamedTester & {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  control: VueControl<any>;
  __asyncSetup?: () => Promise<void>;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type ExtractVueControlData<T extends VueControl<any>> =
  T extends VueControl<infer P> ? P : never;

export type ExtractData<T extends VueControlRenderer> = ExtractVueControlData<
  T["control"]
>;
