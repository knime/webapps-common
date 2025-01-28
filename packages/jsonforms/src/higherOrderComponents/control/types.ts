import type { useJsonFormsControl } from "@jsonforms/vue";

import type { NamedTester, ParameterizedComponent } from "../types";

export type Messages = {
  errors: string[];
};

/**
 * The props that a control can have.
 * I.e., the props of the script setup vue components which are wrapped by modifiers.
 */
export type VueControlProps<D> = {
  control: {
    data: D;
  } & Omit<ReturnType<typeof useJsonFormsControl>["control"]["value"], "data">;
  handleChange: (path: string, value: any) => void;
  changeValue: (newValue: D) => void;
  disabled: boolean;
  labelForId?: null;
  isValid: boolean;
  messages: Messages;
};

/**
 * Optional slots that a control can have to render additional elements.
 */
export type ControlSlots = {
  buttons?: (props: {
    controlHTMLElement?: HTMLElement | null;
    hover: boolean;
  }) => any[];
  icon?: any;
};

export type VueControlParamsFromProps<P> = {
  props: P;
  slots: ControlSlots;
};

export type PropsToComponent<P extends Record<string, any>> =
  ParameterizedComponent<VueControlParamsFromProps<P>>;

export type VueControl<D> = PropsToComponent<VueControlProps<D>>;

export type VueControlRenderer = NamedTester & {
  control: VueControl<any>;
  __asyncSetup?: () => Promise<void>;
};

export type ExtractVueControlData<T extends VueControl<any>> =
  T extends VueControl<infer P> ? P : never;

export type ExtractData<T extends VueControlRenderer> = ExtractVueControlData<
  T["control"]
>;
