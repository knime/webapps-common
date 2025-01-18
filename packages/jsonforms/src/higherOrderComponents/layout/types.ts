import type { useJsonFormsLayout } from "@jsonforms/vue";

import type { NamedTester, ParameterizedComponent } from "../types";

/**
 * The props that a layout can have.
 * I.e., the props of the script setup vue components which are wrapped by modifiers.
 */
export type VueLayoutProps = {
  layout: ReturnType<typeof useJsonFormsLayout>["layout"]["value"] & {
    uischema: {
      [K: string]: any;
    };
  };
};

/**
 * Optional slots that a label can have to render common additional elements.
 */
export type LayoutSlots = {
  buttons?: (props: { hover: boolean }) => any[];
};

export type VueLayout = ParameterizedComponent<{
  props: VueLayoutProps;
  slots: LayoutSlots;
}>;

export type VueLayoutRenderer = NamedTester & {
  layout: VueLayout;
  __asyncSetup?: () => Promise<void>;
};
