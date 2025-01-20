import type { RendererNode, VNode } from "vue";
import { computed, h, ref } from "vue";

import { getAsyncSetupMethod } from "../utils";

import LabeledControl from "./LabeledControl.vue";
import type {
  PropsToComponent,
  VueControl,
  VueControlProps,
  VueControlRenderer,
} from "./types";
import { defineControl } from "./util";

export type VueControlPropsForLabelContent<D> = Omit<
  VueControlProps<D>,
  "labelForId"
> & {
  labelForId: string;
};

export type VueControlThatRequiresLabelWrapper<D> = PropsToComponent<
  VueControlPropsForLabelContent<D>
>;
export const addLabel = <D>(
  {
    control,
    tester,
    name,
    __asyncSetup,
  }: Omit<VueControlRenderer, "control"> & {
    control: VueControlThatRequiresLabelWrapper<D>;
  },
  { fill }: { fill: boolean } = { fill: false },
): Omit<VueControlRenderer, "control"> & { control: VueControl<D> } => ({
  name,
  tester,
  __asyncSetup: __asyncSetup || getAsyncSetupMethod(control),
  control: defineControl((props, { slots }) => {
    const controlRef = ref<RendererNode | null>(null);
    const setControlElement = (vnode: VNode) => {
      if (!controlRef.value) {
        controlRef.value = vnode.el;
      }
    };
    const hideControlHeader = computed(
      () => props.control.uischema.options?.hideControlHeader,
    );
    return () => {
      if (hideControlHeader.value) {
        return h(control, { ...props, labelForId: "" });
      }
      return h(
        LabeledControl,
        {
          label: props.control.label,
          fill,
          hideControlHeader: props.control.uischema.options?.hideControlHeader,
        },
        {
          default: ({ labelForId }: { labelForId: string }) => {
            const vnode = h(control, {
              ...props,
              labelForId,
            });
            setControlElement(vnode);
            return vnode;
          },
          buttons: ({ hover }: { hover: boolean }) => {
            if (!slots.buttons) {
              return null;
            }
            return slots.buttons({
              hover,
              controlHTMLElement: controlRef.value as HTMLElement | null,
            });
          },
          icon: slots.icon,
        },
      );
    };
  }),
});
