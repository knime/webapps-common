import type { RendererNode, VNode } from "vue";
import { computed, h, ref } from "vue";

import LabeledControl from "./LabeledControl.vue";
import type { PropsToComponent, VueControl, VueControlProps } from "./types";
import {
  type SpecialControlRenderer,
  defineControl,
  handleAsyncComponents,
} from "./util";
import { addErrorMessageToVNode } from "./withErrorMessage";

export type VueControlPropsForLabelContent<D> = Omit<
  VueControlProps<D>,
  "labelForId" | "messages"
> & {
  labelForId: string;
};

export type VueControlThatRequiresLabelWrapper<D> = PropsToComponent<
  VueControlPropsForLabelContent<D>
>;

const addLabelToComponent =
  ({ fill }: { fill: boolean } = { fill: false }) =>
  <D>(control: VueControlThatRequiresLabelWrapper<D>): VueControl<D> =>
    defineControl((props, { slots }) => {
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
          },
          {
            default: ({ labelForId }: { labelForId: string }) => {
              const vnode = h(control, {
                ...props,
                labelForId,
              });
              setControlElement(vnode);
              return addErrorMessageToVNode(vnode, props);
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

export const withLabel = <D>(
  renderer: SpecialControlRenderer<VueControlThatRequiresLabelWrapper<D>>,
  config: { fill: boolean } = { fill: false },
) => handleAsyncComponents(addLabelToComponent(config))(renderer);
