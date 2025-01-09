import type { RendererNode, VNode } from "vue";
import { h, ref } from "vue";

import LabeledControl from "./LabeledControl.vue";
import type { PropsToComponent, VueControl, VueControlProps } from "./types";
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
  component: VueControlThatRequiresLabelWrapper<D>,
  fill = false,
): VueControl<D> =>
  defineControl((props, { slots }) => {
    const controlRef = ref<RendererNode | null>(null);
    const setControlElement = (vnode: VNode) => {
      if (!controlRef.value) {
        controlRef.value = vnode.el;
      }
    };
    return () => {
      return h(
        LabeledControl,
        { label: props.control.label, fill },
        {
          default: ({ labelForId }: { labelForId: string }) => {
            const vnode = h(component, {
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
  });
