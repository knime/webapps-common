import { h } from "vue";
import { type LayoutProps, useJsonFormsLayout } from "@jsonforms/vue";

import type { ParameterizedComponent, RendererParams } from "../types";

import type { VueLayout } from "./types";

const corePropsToLayoutProp = (props: LayoutProps) => {
  const processedProps = useJsonFormsLayout(props);
  return {
    layout: processedProps.layout.value,
  };
};

/**
 * The last transformation step, since JSONForms expects renderers with core params.
 */
export const layoutToRenderer =
  (component: VueLayout): ParameterizedComponent<RendererParams> =>
  (props, ctx) =>
    h(component, corePropsToLayoutProp(props as any as LayoutProps), ctx.slots);
