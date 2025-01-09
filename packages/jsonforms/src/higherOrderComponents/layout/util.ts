import {
  type PropType,
  type SetupContext,
  type SlotsType,
  type VNode,
  defineComponent,
} from "vue";

import { type LayoutSlots, type VueLayout, type VueLayoutProps } from "./types";

export const layoutProps = {
  layout: {
    type: Object as PropType<VueLayoutProps["layout"]>,
    required: true,
  },
};

export const defineLayout = (
  setup: (
    props: VueLayoutProps,
    ctx: SetupContext<any, SlotsType<LayoutSlots>>,
  ) => () => VNode | null,
): VueLayout =>
  defineComponent(setup, {
    props: layoutProps,
  });
